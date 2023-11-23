---
layout:     post
title:      "Spring Security's FilterChainProxy"
date:       2023-11-23
categories: [blog]
author:     Daniel Garnier-Moiroux
lang:       en
excerpt:    "Answering questions following my JFall 2023 Spring Security workshop"
---

Earlier this month, I gave a 4-hour pre-conference workshop at [JFall](https://jfall.nl), focused on
Spring Security. The goal was to demystify the architectural concepts that Spring Security builds
upon, so attendees could start implementing their own use-cases easily, without banging their head
on (mostly inadequate) StackOverflow answers.

You can find the workshop on GitHub if you're interested.[^1]

I got a question via e-mail a few days back, from Yağız:

> I was trying to understand more about How `FilterChainProxy` is invoked in `DelegatingFilterProxy`
> but it seems like it is not so easy to find how it is invoked. Is it possible for you to explain
> How `FilterChainProxy` invoked in `DelegatingFilterProxy`.


## Foreword

Before we dive into the explanation, two important warnings. First, this is an involved question, if
you've never really heard about Filters and want to learn more, go watch one of my [Spring Security
talks]() first. I'll wait for you.

You caught up? Good! Second caveat: those details are a framework-level concern, usually users don't
ever need to think about it! Sure, you might have your own very, very, VERY specific use-cases, but
most of the time, that's "below water" and you can Just Trust The Framework™.

Oh, and, please note: I'm not a super expert of how the core framework works internally, so some of
my explantions might be slightly off (or maybe completely wrong?).


## The explanation

The [Spring Security reference doc](https://docs.spring.io/spring-security/reference/servlet/architecture.html)
is actually quite good at explaining this architecture, I recommend you check it out. It's probably
much better than my own explanation, but here we go:


First, [DelegatingFilterProxy](https://docs.spring.io/spring-framework/docs/6.1.0/javadoc-api/org/springframework/web/filter/DelegatingFilterProxy.html)
is a Spring Framework class, for Web MVC. Basically, that's a class for registering Filters as
Spring Beans. If we did not have this, we would have to register our filters using the painful
`web.xml` file ([examples here](https://cloud.google.com/appengine/docs/legacy/standard/java/config/webxml?hl=en)).
With the `DelegatingFilterProxy`, "normal" Servlet Filters are wrapped into a Spring's version of a
Servlet Filter, and so it benefits from Bean lifecycle management, for example. So think about it as
a way to register "general purpose Filters" into your servlet container, not just security filters –
in fact, the `DelegatingFilterProxy` is always there, whether you have Spring Security or not. Some
example non-Spring-Security filters [are listed in the Framework docs](https://docs.spring.io/spring-framework/reference/web/webmvc/filters.html).

We have established that, in Spring, we always go through the `DelegatingFilterProxy` to register 
our servlet Filters.

The [SecurityFilterChain](https://docs.spring.io/spring-security/site/docs/6.1.0/api/org/springframework/security/web/SecurityFilterChain.html),
a Spring Security concept, itself is NOT a `Filter`, it's just a "container" for security-related
Filters. As a reminder, security Filters are not registered as standalone filters, but all live in
the `SecurityFilterChain`, and are a cohesive set of Filters that the Servlet container does not
know about, they just happen to be implemented as Filters. So we need a "bridge" between these
security Filters and the `DelegatingFilterProxy`.

This is accomplished through the `FilterChainProxy` – which a Spring Security, not Framework, class.
The `FilterChainProxy` itself IS a Servlet `Filter`, and thus is registered into the Spring
Framework ApplicationContext, and in the Servlet container, wrapped in a `DelegatingFilterProxy`[^2].
It's the Spring Security entrypoint when a request comes in.

The `FilterChainProxy` contains multiple `SecurityFilterChain`s, and decides which
SecurityFilterChain should be applied to an incoming request. In the FilterChainProxy's "doFilter"
method, some security protections are applied, and the correct SecurityFilterChain is selected – all 
of this in [FilterChainProxy#doFilterInternal](https://github.com/spring-projects/spring-security/blob/3f6b6aa5232fc82223881387fb62565686c45acf/web/src/main/java/org/springframework/security/web/FilterChainProxy.java#L209-L234)

With this `SecurityFilterChain` selected, a [VirtualFilterChain](https://github.com/spring-projects/spring-security/blob/3f6b6aa5232fc82223881387fb62565686c45acf/web/src/main/java/org/springframework/security/web/FilterChainProxy.java#L342-L377) wrapping the SecurityFilterChain is created, and then #doFilter is invoked on that VirtualFilterChain
(which is only created for the request, unlike the SecurityFilterChain which is sort of a
"configuration" class). This is where Security Filters are called, and where you get to the more
"familiar" territory that I discuss in my talks.


Thanks for the great question, Yağız!

---


[^1]: You can find the [course material on GitHub](https://github.com/Kehrlann/spring-security-architecture-workshop/),
      but it's missing the explanations I give before each module, and the debriefs for particular
      pieces of code. To complement it, you could watch my Spring Security talk at
      [Voxxed Zürich 2023](https://www.youtube.com/watch?v=TrCLf9zAQfs), which is a good companion
      to the workshop. There are also longer versions of that talk, and versions in French - check
      out my [talks](/talks) page to find those.

[^2]: The registration happens in [AbstractSecurityWebApplicationInitializer](https://github.com/spring-projects/spring-security/blob/8e93e4715fad221c4d11cc138dcbb93ed1c558a1/web/src/main/java/org/springframework/security/web/context/AbstractSecurityWebApplicationInitializer.java#L133-L141)
      if you are really really curious about the internals, but honestly it's very hard to follow.
      That's because the `@Bean` that is wrapped in the `DelegatingFilterProxy` is defined somewhere
      else, in
      [WebSecurityConfiguration](https://github.com/spring-projects/spring-security/blob/8e93e4715fad221c4d11cc138dcbb93ed1c558a1/config/src/main/java/org/springframework/security/config/annotation/web/configuration/WebSecurityConfiguration.java#L104-L122).


