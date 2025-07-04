---
layout:     post
title:      "Spring Security's ObjectPostProcessor"
date:       2025-07-04
categories: [blog]
author:     Daniel Garnier-Moiroux
lang:       en
excerpt:    "How to modify Spring Security-created objects with an ObjectPostProcessor"
---

Spring Security executes a delicate balancing act: it provides "sane" defaults, that work well in
most cases, while being extremely customizable. Customization mostly happens in the
<a href="https://docs.spring.io/spring-security/site/docs/current/api/org/springframework/security/config/annotation/web/builders/HttpSecurity.html">HttpSecurity</a> builder you use to create a `SecurityFilterChain` (or
in <a href="https://docs.spring.io/spring-security/site/docs/current/api/org/springframework/security/config/web/server/ServerHttpSecurity.html">ServerHttpSecurity</a> if you're using webflux).
An example would be to set the URL users are redirected to when they log out, like so:

```java
@Bean
SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
  return http
    // ... your rules ...
    .logout(logout -> {
      logout.logoutSuccessUrl("/welcome");
    })
    .build();
}
```

But exposing every configurable knob in the HttpSecurity API would make it too verbose. Users would
have a hard time getting started: the common options would be drowned in a sea of methods that they
probably wouldn't need. Some configuration can be achieved through beans, but that's on a
case-by-case basis. Refer to the excellent <a href="https://docs.spring.io/spring-security/reference/">reference documentation</a> to learn about all the available configuration for the very specific feature you are using.
Sometimes, you won't find exactly what you need, so the last resort way to modify the defaults from Spring Security is to use an `ObjectPostProcessor`.

## The ObjectPostProcessor API

Spring Framework has a <a href="https://docs.spring.io/spring-framework/reference/core/beans/factory-extension.html#beans-factory-extension-bpp">BeanPostProcessor</a> concept, that allows to modify beans when they are created.
This is useful, because the beans in your Spring application context may have been created by some code
that you do not own, for example, by Spring Boot. With "post-processing", you can modify them
without having to create full beans yourself. Trust Spring Boot, but sprinkle some custom behavior
on top.

Spring Security creates of objects that are _not_ beans, they are not in the application context.
They are not intended to be used by the rest of the application, and so they are not exposed. If you
want to modify them, you can register an `ObjectPostProcessor`. It is an extremely simple interface,
with a single method that takes an object `O` and returns `? extends O`, so either the object
itself, another instance of the same type, or a subclass. The generic structure is like so, say, for
post-processing all `AuthenticationProvider`s:

```java
class MyObjectPostProcessor implements ObjectPostProcessor<AuthenticationProvider> {

  @Override
  public <O extends AuthenticationProvider> O postProcess(O object) {
    // transform the "object" with your code
    return object;
  }

}
```

Then Spring Security uses that class to transform the objects it creates, essentially doing:

```java
someSpringSecurityObject = this.objectPostProcessor.postProcess(someSpringSecurityObject);
```

Spring Security uses
<a href="https://github.com/spring-projects/spring-security/blob/d8043dc8a771e28cee24f1ce566734e787c719b4/config/src/main/java/org/springframework/security/config/annotation/web/configurers/oauth2/client/OAuth2LoginConfigurer.java#L331">that</a>
<a href="https://github.com/spring-projects/spring-security/blob/d8043dc8a771e28cee24f1ce566734e787c719b4/config/src/main/java/org/springframework/security/config/annotation/web/configurers/CsrfConfigurer.java#L268">pattern</a>
<a href="https://github.com/spring-projects/spring-security/blob/d8043dc8a771e28cee24f1ce566734e787c719b4/config/src/main/java/org/springframework/security/config/annotation/web/configurers/ott/OneTimeTokenLoginConfigurer.java#L135">everywhere</a>.

## When, and how to use ObjectPostProcessor

Let's take a concrete example. Let's say you want to add a custom "authentication result converter" to
the class <a href="https://docs.spring.io/spring-security/site/docs/current/api/org/springframework/security/oauth2/client/web/OAuth2LoginAuthenticationFilter.html">OAuth2LoginAuthenticationFilter</a>.
The specific details of this class, or what that converter does in practice, are not relevant to
this example: they're advanced features that very few users need, and the idea is to show you where
the configuration hooks are. The `OAuth2LoginAuthenticationFilter` is created when you do
`.oauth2Login(...)` on your security filter chain configuration. It has a
`.setAuthenticationResultConverter(...)` method, that you can call ... But for this, you need an
instance of that object. You have two choices: create your own instance manually, or modify an
instance that Spring Security creates for you.

If you were to do it manually, you'd have to do something like:

```java
var filter = new OAuth2LoginAuthenticationFilter(
  clientRegistrationRepository,
  authorizedClientService
);
filter.setAuthenticationResultConverter(new MyCustomConverter());
```

This is fine, but where do you get those parameters for the constructor? You have to figure that out
by yourself, and you'll probably have to read a fair bit of Spring Security code to get it right. So
instead of doing that, let's modify the instance Spring Security creates for you, with a
post-processor. First, let's create a post-processor:


```java
class OAuth2LoginFilterPostProcessor implements ObjectPostProcessor<OAuth2LoginAuthenticationFilter> {

  @Override
  public <O extends OAuth2LoginAuthenticationFilter> O postProcess(O filter) {
    filter.setAuthenticationResultConverter(new MyCustomConverter());
    return filter;
  }

}
```

That post-processor will ONLY change `OAuth2LoginAuthenticationFilter` instances, and will not
transform anything else. To make it do its magic, you only need to register it:

```java
@Bean
SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
  return http
      // ... your custom configuration ...
      .oauth2Login(oauth2 ->
          oauth2.withObjectPostProcessor(new OAuth2LoginFilterPostProcessor())
      )
      .build();
}
```

By registering it inside `.oauth2Login`, you scope it to only objects in that part of the
configuration, and you're sure that it won't modify anything else.


## Advanced usage: delegation

There's one more fun thing you can do with post-processors. Sometimes, the object that Spring
Security gives you does not have the extension point you need, but has a lot of logic you'd like to
reuse. So you could create a subclass, but it is sometimes impossible because some Spring Security
classes are still final, e.g. `AuthorizedClientServiceOAuth2AuthorizedClientManager`. Another
problem with subclasses is that you would have to think about all the dependencies of those classes
and figure out how they should be set up. For example, the authentication provider used for oauth2
login is `OidcUserService`, with a total of 5 private fields. That's a lot to think about!

Much easier is to do composition - you create a class that implements the correct interface, grab
whatever Spring Security has wired in for you, and do pre or post-processing in addition to what the
base class does. For example, with our `OidcUserService` above:

```java
public class CustomOidcUserService extends OidcUserService {

  private final OidcUserService delegate;

  public CustomOidcUserService(OidcUserService delegate) {
    this.delegate = delegate;
  }

  @Override
  public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {
    // Modify the parameters passed to the delegate
    var modifiedUserRequest = modifyUserRequest(userRequest);

    // Call the delegate that was configured by Spring Security
    var user = this.delegate.loadUser(modifiedUserRequest);

    // Modify the result from the delegate
    var modifiedUser = modifyUser(user);

    return modifiedUser;
  }

}
```

You could imagine that you do some pre-processing for rate-limiting, or some post-processing for
checking people logging in against their work schedule. To use that, you would write the following
post-processor:

```java
class OidcUserServicePostProcessor implements ObjectPostProcessor<OidcUserService> {

  @Override
  public OidcUserService postProcess(OidcUserService userService) {
    return new CustomOidcUserService(userService);
  }

}
```

Don't forget to register it, and voilà, you benefit from some Spring Security goodness with your
custom behavior added on top!
