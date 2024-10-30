---
layout:     post
title:      "Custom Authorization header in Reactive Spring Security OAuth2"
date:       2024-10-30
categories: [blog]
author:     Daniel Garnier-Moiroux
lang:       en
excerpt:    "Overriding the default behavior of ServerOAuth2AuthorizedClientExchangeFilterFunction"
---

Someone asked me a Spring Security question today, along the lines of:

> When using Spring Security OAuth2, in reactive apps, we use the [WebClient
> integration](https://docs.spring.io/spring-security/reference/reactive/oauth2/client/authorized-clients.html#oauth2Client-webclient-webflux)
> Is it possible to change the header that the `ServerOAuth2AuthorizedClientExchangeFilterFunction`
> uses? By default it uses `Authorization: Bearer <access_token>`, but we'd like to drop the
> `Bearer` part for \*\*reasons\*\*, and send `Authorization: <access_token>` instead.

The answer is no, you can't customized the header used in
`ServerOAuth2AuthorizedClientExchangeFilterFunction` (what a mouthful, let's call it oauth-EFF),
because [it is
hardcoded](https://github.com/spring-projects/spring-security/blob/7ba8986506daca7df716b7fed1ff23aee1cb1b92/oauth2/oauth2-client/src/main/java/org/springframework/security/oauth2/client/web/reactive/function/client/ServerOAuth2AuthorizedClientExchangeFilterFunction.java#L422),
to follow RFC6750, specifically [2.1.  Authorization Request Header
Field](https://datatracker.ietf.org/doc/html/rfc6750#section-2.1).

My first recommendation would be to update the resource servers to be spec compliant, and access the
specified header format, `Authorization: Bearer <access_token>`. If you have legacy clients that
cannot be updated, you could imagine a world where your resource server supports the OAuth2 spec,
and your legacy non-Bearer tokens.

If _that_ is not possible, fret not, there is a way around it: you can make your own
`ExchangeFilterFunction`, that "updates" the value of the `Authorization` header:


```java
import reactor.core.publisher.Mono;

import org.springframework.web.reactive.function.client.ClientRequest;
import org.springframework.web.reactive.function.client.ClientResponse;
import org.springframework.web.reactive.function.client.ExchangeFilterFunction;
import org.springframework.web.reactive.function.client.ExchangeFunction;

class CustomAuthorizationExchangeFilterFunction implements ExchangeFilterFunction {

  @Override
  public Mono<ClientResponse> filter(ClientRequest request, ExchangeFunction next) {
    return Mono.just(request).map(req -> {
      // Grab the original authorization header created by Spring Security
      var originalHeader = req.headers().getFirst("Authorization");
      // Extract the token from the header
      var token = originalHeader.toLowerCase().substring("bearer ".length());
      return ClientRequest.from(req)
        // Remove the existing header entirely ; because calling ".header" would add an additional
        // header value, rather than replace the existing value
        .headers(h -> h.remove("Authorization"))
        // Set the Authorization header to the desired value
        .header("Authorization", token)
        .build();
    }).flatMap(next::exchange);
  }

}
```

Then you can use it in addition to the oauth-EFF, _after_ the oauth-EFF is applied. This way, all
the token management is handled by the oauth-EFF, and you just sprinkle some magic over the headers:

```java
@Bean
WebClient customHeaderWebClient(ReactiveOAuth2AuthorizedClientManager authorizedClientManager) {
  ServerOAuth2AuthorizedClientExchangeFilterFunction oauth2ClientFilterFunction = 
      new ServerOAuth2AuthorizedClientExchangeFilterFunction(authorizedClientManager);
  return WebClient.builder()
    .filter(oauth2ClientFilterFunction)
    .filter(new CustomAuthorizationExchangeFilterFunction())
    .build();
}
```

Tadaaaa 🎉️
