---
layout:     post
title:      "Beyond hasRole(\"...\") in Spring Security"
date:       2024-11-04
categories: [blog]
author:     Daniel Garnier-Moiroux
lang:       en
excerpt:    "Authorization rules beyond hasRole"
---

Another Spring Security question today:

> My users are part of a "company", and are allowed to see the data from the company only.
> Moreover, users have roles, e.g. "user", "admin". Only "admin" can see the admin endpoints.
> How can I implement this?


There are many ways to do this. I created a [sample
application](https://github.com/Kehrlann/spring-security-samples/tree/main/authorization) for this, which we will go over.
But first, let's start by describing the use-case.


## The use-case

Let's start with our users:

| username | company      | roles           |
|----------|--------------|-----------------|
| `alice`  | `Alpha Corp` | `user`, `admin` |
| `bob`    | `Alpha Corp` | `user`          |
| `carol`  | `Omega Inc`  | `user`          |
| `dave`   | `Omega Inc`  | `user`, `admin` |

Then the rules:

1. Users can only view pages in their own company. For example, users of `Alpha Corp` can access
   pages under `/company/alpha`, but not under `/company/omega`.
2. Only users with the `admin` role can view the admin pages, e.g. `/company/alpha/admin`.

Some examples:

- Alice can access `/company/alpha` and `/company/alpha/admin`, but not `/company/omega` because she
  is not part of Omega Inc.
- Carol can access `/company/omega`, but neither `/company/omega/admin` because she's not admin, nor
  `/company/alpha` because she is not part of Alpha Corp.


## Implementation: setting up the model and basic security

The roles fit neatly into a user's `List<GrantedAuthority>`, usually
prefixed with `ROLE_`, e.g. `ROLE_admin`.  This is described at length in the [reference
documentation](https://docs.spring.io/spring-security/reference/servlet/authorization/authorize-http-requests.html#authorize-requests).
The "company" bit here is more fuzzy, as it's not really a "role". You could imagine an authority
e.g. `COMPANY_<companyId>` but this is structured data, that maybe you wouldn't want to represent as
a String. You _could_ make a custom `GrantedAuthority`, which Spring Security supports. But maybe
it's also a property of the User object that you use for business reasons, so you could also store
it in the User object.

Let's make some custom users, that reference a company. All users use the `password` password
(secure, right?!):

```java
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;

class CustomUser extends User {

    private final Company company;

    // Don't do this in prod. It's just for demos.
    private static final PasswordEncoder encoder = PasswordEncoderFactories.createDelegatingPasswordEncoder();

    public CustomUser(String username, Company company, String... authorities) {
        //@formatter:off
        super(
                username,
                encoder.encode("password"),
                // Encode authorities to "roles"
                AuthorityUtils.createAuthorityList(Arrays.stream(authorities).map(a -> "ROLE_" + a).toArray(String[]::new))
        );
        //@formatter:on
        this.company = company;
    }

    public CustomUser(CustomUser customUser) {
        super(customUser.getUsername(), customUser.getPassword(), customUser.getAuthorities());
        this.company = customUser.getCompany();
    }

    public Company getCompany() {
        return company;
    }

}

// The company is a simple record

record Company(String id, String name) {

}
```



We're going to allow users to log in with username and password, so we need to expose a
`UserDetailsService` bean. Since our users are custom, we need to make a custom implementation. The
default `InMemoryUserDetailsManager` wouldn't do, because it returns plain Spring-Security `User`
instances. Notice that `loadByUsername` needs to return a copy of the in-memory user object. This is
because Spring Security deletes the password from the `User` when they log in, to avoid leaking it
to your application code and increase security (this way, you won't ever print it in your logs!).
Here's the implementation:

```java
import java.util.Arrays;
import java.util.Map;
import java.util.function.Function;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import static java.util.stream.Collectors.toUnmodifiableMap;

class CustomUserDetailsService implements UserDetailsService {

    private final Map<String, CustomUser> users;

    public CustomUserDetailsService(CustomUser... users) {
        this.users = Arrays.stream(users).collect(toUnmodifiableMap(CustomUser::getUsername, Function.identity()));
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return new CustomUser(users.get(username));
    }

}
```

We can then use those constructs in the typical "Security Configuration class" to allow log-in. We
create our four users, and set up security. For brevity, we omit the "Company Repository", which can
be a JPA repo, an in-memory map, etc:

```java

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authorization.AuthorizationDecision;
import org.springframework.security.authorization.AuthorizationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.intercept.RequestAuthorizationContext;
import static org.springframework.security.authorization.AuthorityAuthorizationManager.hasRole;
import static org.springframework.security.authorization.AuthorizationManagers.allOf;

@Configuration
@EnableWebSecurity
class SecurityConfiguration {

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http.authorizeHttpRequests(auth -> {
            auth.requestMatchers("/", "favicon.ico", "error").permitAll();
            auth.anyRequest().authenticated();
        })
            .formLogin(Customizer.withDefaults())
            .httpBasic(Customizer.withDefaults())
            .logout(logout -> logout.logoutSuccessUrl("/"))
            .build();
    }

    @Bean
    UserDetailsService userDetailsService(CompanyRepository repository) {
        //@formatter:off
        return new CustomUserDetailsManager(
                new CustomUser("alice", repository.findById("alpha"), "user", "admin"),
                new CustomUser("bob", repository.findById("alpha"), "user"),
                new CustomUser("carol", repository.findById("omega"), "user"),
                new CustomUser("dave", repository.findById("omega"), "user", "admin")
        );
        //@formatter:on
    }

}
```

With this, any user can make a request, either by navigating to http://localhost:8080/foo and
logging in, or with curl:

```
curl http://localhost:8080/foo --user alice:password
```


## Implementation: authorization rules

The first, simplest rule, is checking the roles for the admin endpoint. Filtering by roles is done
by the usual `.requestMatchers(".../admin").hasRole("admin")`, see reference documentation
[Servlet > Authorization > HTTP](https://docs.spring.io/spring-security/reference/servlet/authorization/authorize-http-requests.html#match-requests).


If we want to authorize based on the company, we can't rely on roles or authorities. Before Spring
Security 6, we would have needed a special bean to check for access and maybe a SpEL expression like
`.access("hasRole('admin') && @companyVerifier.isInCompany(authentication)")`. With newer versions,
we can do this programmatically, with the `AuthorizationManager<RequestAuthorizationContext>` type.
It is a functional interface, that takes the authentication and the "authentication context" (here,
think "the request") as parameters, and returns an `AuthorizationDecision` which can be true or
false, see [reference
docs](https://docs.spring.io/spring-security/reference/servlet/authorization/authorize-http-requests.html#remote-authorization-manager).
We'd write something like:

```java
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authorization.AuthorizationDecision;
import org.springframework.security.authorization.AuthorizationManager;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.access.intercept.RequestAuthorizationContext;

@Configuration
@EnableWebSecurity
class SecurityConfiguration {

    // ...

    private static AuthorizationManager<RequestAuthorizationContext> isInCompany() {
        return (authentication, requestAuthorizationContext) -> {
            if (authentication == null) {
                return new AuthorizationDecision(false);
            }

            if (!(authentication.get().getPrincipal() instanceof CustomUser user)) {
                return new AuthorizationDecision(false);
            }

            var companyId = requestAuthorizationContext.getVariables().get("companyId");
            return new AuthorizationDecision(user.getCompany().id().equals(companyId));
        };
    }
}
```

The above states:

1. The user MUST be authenticated. It is redudant for what we want, but adds type-safety.
2. The user MUST be of type CustomUser. Again, redudant as is it will always be the case.
3. The user's companyId MUST match that of the request.

This can then be used:

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
class SecurityConfiguration {

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http.authorizeHttpRequests(auth -> {
            auth.requestMatchers("/", "favicon.ico", "error").permitAll();
            auth.requestMatchers("/company/{companyId}/**").access(isInCompany());
            auth.anyRequest().denyAll();
        })
            // ...
            .build();
    }

    // ...

}
```

Notice that the `{companyId}` path variable must match what we had in our `isInCompany`
authorization manager.

But this only restricts by company, not by role. If we want to combine this check and the admin role
check, we can reuse the authorization manager above, that is designed to do one thing, and compose
it with other authorization rules. Here we'll use `AuthorizationManagers.allOf(...)` and combine our
authorization rule with `AuthorizationManagers.hasRole(...)`.

Note that the admin rule is more specific than the company "non-admin" endpoints, so it must come
first:

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import static org.springframework.security.authorization.AuthorityAuthorizationManager.hasRole;
import static org.springframework.security.authorization.AuthorizationManagers.allOf;

@Configuration
@EnableWebSecurity
class SecurityConfiguration {

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http.authorizeHttpRequests(auth -> {
            auth.requestMatchers("/", "favicon.ico", "error").permitAll();
            //@formatter:off
            auth.requestMatchers("/company/{companyId}/admin")
                    .access(
                            allOf(
                                    isInCompany(),
                                    hasRole("admin")
                            )
                    );
            //@formatter:on

            auth.requestMatchers("/company/{companyId}/**").access(isInCompany());
            auth.anyRequest().denyAll();
        })
            .formLogin(Customizer.withDefaults())
            .httpBasic(Customizer.withDefaults())
            .logout(logout -> logout.logoutSuccessUrl("/"))
            .build();
    }

    // ...

}
```

Tadaaaa 🎉️

Of course, there are many ways to go about this, and the above is just one of the possible
implementations. I like the composition of authorization rules, though.

If you'd like to test the whole project, head over to the [sample application](https://github.com/Kehrlann/spring-security-samples/tree/main/authorization) and see for yourself!
