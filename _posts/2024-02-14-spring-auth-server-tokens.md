---
layout:     post
title:      "Spring Authorization Server customization"
date:       2024-02-12
categories: [blog]
author:     Daniel Garnier-Moiroux
lang:       en
excerpt:    "How to customize token responses from Spring Authorization Server"
---


Got a question over e-mail from Jaffar (hi 👋). He asks:

> I am using [Spring-Authorization-Server](https://github.com/spring-projects/spring-authorization-server)
> to build my own auth server. I want to change the output of the `/oauth2/token` response so that
> the `refresh_token` is a JWT ; and that I can add custom parameters in the token response itself.

So basically, something like this:

```json
{
  "access_token": "...",
  "token_type": "Bearer",
  "expires_in": -1,
  "refresh_token": "<make this a JWT>", ⬅️
  "my_parameter": "<a custom entry, with a custom>" ⬅️
}
```

Let's address those two.

Before we start, I should note that these answers were tested with Spring Auth Server `1.2.1`.


## Refresh token as a JWT

First, it's good idea to question _why_ you would want this. The [OAuth 2.1 spec](https://www.ietf.org/archive/id/draft-ietf-oauth-v2-1-10.html#name-refresh-token)
states (emphasis mine):

> A refresh token is a string representing the authorization granted to the client by the resource
> owner. The string **is considered opaque to the client**. The refresh token may be an identifier
> used to retrieve the authorization information or may encode this information into the string
> itself. Unlike access tokens, **refresh tokens are intended for use only with authorization
> servers** and are never sent to resource servers.

The spec says that the refresh token is **opaque** to the client. That means the client SHOULD NOT
try and derive specific information from it. However, it says that the token MAY carry some
information, encoded in whatever way you see fit. But it seems to imply that this information is
only meant for the authorization server itself, e.g. for knowing when it expires, etc.

That's not the model that Spring Authorization Server uses, it uses the "identifier" model, where
the token is just a string that points to some data in a Repository (~= a database) in the
Authorization Server itself, and all of that is handled by Spring-Auth-Server. So in theory, there
is no use for a JWT in a refresh token.

But you know, in practice, you may have your own use-cases, and, for end-user application, it _may_
make sense to stray from the spec. It is a slippery slope, as your use-cases grow and you get more
consumers of your Auth-Server, they all rely on non-standard behavior. And that means the Clients
and Resource Servers tend to be coupled more and more tightly to your own behavior, making it hard
to swap your custom Auth Server for another implementation. You are forcing yourself to maintain
this solution.

But that may bring a lot of value to you, and therefore be a reasonable trade-off. So, let's take a
look, and learn how to parse this codebase.

The refresh tokens are generated in three places:
- `OAuth2AuthorizationCodeAuthenticationProvider` when using the authorization_code grant
- `OAuth2DeviceCodeAuthenticationProvider` when using the device_code grant
- `OAuth2RefreshTokenAuthenticationProvider` when exchanging the refresh_token for new tokens

For the sake of the demonstration, let's use the [OAuth2AuthorizationCodeAuthenticationProvider](https://github.com/spring-projects/spring-authorization-server/blob/a04b336a0cdc70279d3de4415685776e99f1581b/oauth2-authorization-server/src/main/java/org/springframework/security/oauth2/server/authorization/authentication/OAuth2AuthorizationCodeAuthenticationProvider.java)
class. Take a look at how tokens are generated, [specifically refresh tokens](https://github.com/spring-projects/spring-authorization-server/blob/a04b336a0cdc70279d3de4415685776e99f1581b/oauth2-authorization-server/src/main/java/org/springframework/security/oauth2/server/authorization/authentication/OAuth2AuthorizationCodeAuthenticationProvider.java#L217-L236).
It uses this `OAuth2TokenGenerator` interface, which has a implementation for each token type (JWT,
AccessToken, RefreshToken, etc.). And it has a "wrapper" implementation, [DelegatingOAuth2TokenGenerator](https://github.com/spring-projects/spring-authorization-server/blob/a04b336a0cdc70279d3de4415685776e99f1581b/oauth2-authorization-server/src/main/java/org/springframework/security/oauth2/server/authorization/token/DelegatingOAuth2TokenGenerator.java),
which tries each of the sub-generators one by one, and uses whichever does not return null.
Following the trail, you'll find that it's wired in `OAuth2TokenEndpointConfigurer`, through
[OAuth2ConfigurerUtils](https://github.com/spring-projects/spring-authorization-server/blob/a04b336a0cdc70279d3de4415685776e99f1581b/oauth2-authorization-server/src/main/java/org/springframework/security/oauth2/server/authorization/config/annotation/web/configurers/OAuth2ConfigurerUtils.java#L100-L124).

To generate a custom refresh token, then, you need to provide your own `OAuth2TokenGenerator` bean.
It must handle both access tokens and refresh tokens, as to not break the existing behavior. And in
the specific refresh token generator, the refresh token value can be customized. Something like this:

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

  // ... the rest of the security config ...

  @Bean
  public OAuth2TokenGenerator<OAuth2Token> tokenGenerator(JWKSource<SecurityContext> jwkSource) {
    // The default JWT generator, for access tokens
    var jwtEncoder = new NimbusJwtEncoder(jwkSource);
    var jwtGenerator = new JwtGenerator(jwtEncoder);

    // Our custom refresh token generator
    var refreshTokenGenerator = new CustomRefreshTokenGenerator();

    // We do not include the opaque token generator, OAuth2AccessTokenGenerator, because we're only
    // doing JWT in this example
    return new DelegatingOAuth2TokenGenerator(jwtGenerator, refreshTokenGenerator);
  }

  /**
   * Custom refresh token generator, most of the code is lifted from OAuth2RefreshTokenGenerator.
   */
  static class CustomRefreshTokenGenerator implements OAuth2TokenGenerator<OAuth2RefreshToken> {
    @Nullable
    @Override
    public OAuth2RefreshToken generate(OAuth2TokenContext context) {
      // 📋 BEGIN copy-paste from OAuth2RefreshTokenGenerator
      // Some formatting altered to fit on the blog
      if (!OAuth2TokenType.REFRESH_TOKEN.equals(context.getTokenType())) {
        return null;
      }
      if (isPublicClientForAuthorizationCodeGrant(context)) {
        // Do not issue refresh token to public client
        return null;
      }

      Instant issuedAt = Instant.now();
      var configuredTtl = context.getRegisteredClient().getTokenSettings().getRefreshTokenTimeToLive();
      Instant expiresAt = issuedAt.plus();
      // 📋 END copy-paste

      //🚨 Here is where you set your custom value
      return new OAuth2RefreshToken("jaffars-custom-token", issuedAt, expiresAt);
    }

    // 📋 Pure copy-paste from OAuth2RefreshTokenGenerator
    private static boolean isPublicClientForAuthorizationCodeGrant(OAuth2TokenContext context) {
      if (AuthorizationGrantType.AUTHORIZATION_CODE.equals(context.getAuthorizationGrantType()) &&
           (
            context.getAuthorizationGrant().getPrincipal()
            instanceof OAuth2ClientAuthenticationToken clientPrincipal
           )
         ) {
        return clientPrincipal.getClientAuthenticationMethod().equals(ClientAuthenticationMethod.NONE);
      }
      return false;
    }

  }

}
```

Now this is a _terrible_ refresh token generator, everyone gets `jaffars-custom-token`. DO NOT,
EVER, do that. Instead you should generate the JWT you want. You could get inspiration in the
existing access token [JwtGenerator](https://github.com/spring-projects/spring-authorization-server/blob/a04b336a0cdc70279d3de4415685776e99f1581b/oauth2-authorization-server/src/main/java/org/springframework/security/oauth2/server/authorization/token/JwtGenerator.java).

If you dislike bean-based configuration, you can also set the `TokenGenerator` in the 
`OAuth2AuthorizationServerConfigurer` by calling the
`.tokenGenerator(OAuth2TokenGenerator generator)` method.

There it is! But, remember, you probably do not need to do this.


## Customizing the token response

This is a more common scenario. It is supported in the `1.2.x` versions, but the API is not the
nicest. However, improvements are coming in `1.3.x`[^1].

In the meantime, the easiest thing is to find where the `/oauth2/token` response is created, in the
`OAuth2TokenEndpointFilter`, specifically in the `authenticationSuccessHandler`. The default is
currently implemented as [a private
method](https://github.com/spring-projects/spring-authorization-server/blob/2fbe717f44ce70760c9fed6625eda614fe2f7ce5/oauth2-authorization-server/src/main/java/org/springframework/security/oauth2/server/authorization/web/OAuth2TokenEndpointFilter.java#L221-L247).
We can lift that code and add our own, and then wire it in the SecurityConfiguration

```java
@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    var authServerConfigurer = new OAuth2AuthorizationServerConfigurer();
    authServerConfigurer
        .tokenEndpoint(token -> token.accessTokenResponseHandler(new CustomTokenResponseHandler()));
        // other configurations ...
    http
        .with(authServerConfigurer, Customizer.withDefaults())
        // all your filter chain configuration
        .build();
  }

  /**
   * Code lifted from OAuth2TokenEndpointFilter#sendAccessTokenResponse.
   */
  static class CustomTokenResponseHandler implements AuthenticationSuccessHandler {

    private final OAuth2AccessTokenResponseHttpMessageConverter accessTokenHttpResponseConverter
      = new OAuth2AccessTokenResponseHttpMessageConverter();

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
        Authentication authentication) throws IOException, ServletException {
      // 📋 BEGIN copy-paste from OAuth2TokenEndpointFilter.sendAccessTokenResponse(...)
      // Some formatting altered to fit on the blog
      OAuth2AccessTokenAuthenticationToken accessTokenAuthentication 
        = (OAuth2AccessTokenAuthenticationToken) authentication;

      OAuth2AccessToken accessToken = accessTokenAuthentication.getAccessToken();
      OAuth2RefreshToken refreshToken = accessTokenAuthentication.getRefreshToken();
      Map<String, Object> additionalParameters = accessTokenAuthentication.getAdditionalParameters();

      OAuth2AccessTokenResponse.Builder builder
        = OAuth2AccessTokenResponse.withToken(accessToken.getTokenValue())
          .tokenType(accessToken.getTokenType())
          .scopes(accessToken.getScopes());
      if (accessToken.getIssuedAt() != null && accessToken.getExpiresAt() != null) {
        var exp = ChronoUnit.SECONDS.between(accessToken.getIssuedAt(), accessToken.getExpiresAt());
        builder.expiresIn(exp);
      }
      if (refreshToken != null) {
        builder.refreshToken(refreshToken.getTokenValue());
      }
      // 📋 END copy-paste

      // 🚨 Here we create a map that contains our new parameters, as well as the
      // original additional parameters. This is where we add a custom claim.
      var otherParams = new HashMap<String, Object>();
      otherParams.put("my_parameter", "and here we add a custom value");
      if (!CollectionUtils.isEmpty(additionalParameters)) {
        // Those are the additional parameters from the original authentication
        // process.
        // Importantly, it contains the `id_token` value.
        otherParams.putAll(additionalParameters);
      }
      builder.additionalParameters(otherParams);

      // 📋 Some more copy-paste
      OAuth2AccessTokenResponse accessTokenResponse = builder.build();
      ServletServerHttpResponse httpResponse = new ServletServerHttpResponse(response);
      this.accessTokenHttpResponseConverter.write(accessTokenResponse, null, httpResponse);
    }

  }

}
```

And there it is, you can put whatever you want in your access token response. Look out for the
improvements in the next version!


[^1]: There is [a PR that has been merged](https://github.com/spring-projects/spring-authorization-server/pull/1429)
      by a former colleague of mine. It will simplify the API, by having a "customizer" for the
      access token response context.

