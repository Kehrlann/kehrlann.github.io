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
the token is just a string that points to some data in a Repository (~= a database). So in theory,
there is no need to do that.

But you know, in practice, you may have your own use-cases, so let's take a look.

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

So basically, you "just" need to provide your own `OAuth2TokenGenerator` bean, that must handle both
access tokens and refresh tokens, with refresh tokens being custom. Something like so:

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

  // ... the rest of the security config ...

  @Bean
  public OAuth2TokenGenerator<OAuth2Token> tokenGenerator(JWKSource<SecurityContext> jwkSource) {
    var jwtEncoder = new NimbusJwtEncoder(jwkSource);
    var jwtGenerator = new JwtGenerator(jwtEncoder);
    var refreshTokenGenerator = new CustomRefreshTokenGenerator();
    return new DelegatingOAuth2TokenGenerator(jwtGenerator, refreshTokenGenerator);
  }

  /**
   * Custom refresh token generator, most of the code is lifted from OAuth2RefreshTokenGenerator.
   */
  static class CustomRefreshTokenGenerator implements OAuth2TokenGenerator<OAuth2RefreshToken> {
    @Nullable
    @Override
    public OAuth2RefreshToken generate(OAuth2TokenContext context) {
      if (!OAuth2TokenType.REFRESH_TOKEN.equals(context.getTokenType())) {
        return null;
      }
      if (isPublicClientForAuthorizationCodeGrant(context)) {
        // Do not issue refresh token to public client
        return null;
      }

      Instant issuedAt = Instant.now();
      Instant expiresAt = issuedAt.plus(context.getRegisteredClient().getTokenSettings().getRefreshTokenTimeToLive());

      //🚨 Here is where you set your custom value
      return new OAuth2RefreshToken("jaffars-custom-token", issuedAt, expiresAt);
    }

    private static boolean isPublicClientForAuthorizationCodeGrant(OAuth2TokenContext context) {
      if (AuthorizationGrantType.AUTHORIZATION_CODE.equals(context.getAuthorizationGrantType()) &&
          (context.getAuthorizationGrant().getPrincipal() instanceof OAuth2ClientAuthenticationToken clientPrincipal)) {
        return clientPrincipal.getClientAuthenticationMethod().equals(ClientAuthenticationMethod.NONE);
      }
      return false;
    }
  }

}
```

Now this is a _terrible_ refresh token generator, everyone gets `jaffars-custom-token`. DO NOT,
EVER, do that. Instead you should generate the JWT you want, maybe taking example on the access
token [JwtGenerator](https://github.com/spring-projects/spring-authorization-server/blob/a04b336a0cdc70279d3de4415685776e99f1581b/oauth2-authorization-server/src/main/java/org/springframework/security/oauth2/server/authorization/token/JwtGenerator.java).

There it is! But, remember, you probably do not need to do this.


## Customizing the token response

This is much more straight


I love giving conference talks. My primary focus is demystifying how code works, or showing cool
stuff. Some speakers go the safer way of pasting some code on slides: you only write the code once,
give it an acceptable shape, and be done with it. No awkward fumbling and debugging live something
that used to work, just yesterday, I SWEAR.

Personally, I can't focus for 50 minutes on a slide deck chock-full of code. That's because there's
very little _rhythm_ in the code that gets shown. The speaker may be great, and may be able to make
the rest of the presentation entertaining. But the code is very inert.

And I can't consume inert code just by squinting at it in sequence - I need to build a mental model
of how things fit together, I need to go back and forth, explore, make hypotheses, maybe experiment.
And if someone is giving me a tour of the code instead, it should be a conversation, where I can
rephrase what is explained to me and ask questions. This gives the other person some feedback to
adjust their discourse, insist on this or that, speak at a different level of abstraction, etc.
Which obviously does not happen when you're showing slides to a room of 107 people.

So, while code-on-slides may be easier, or safer, that's not what I like. I do enjoy a good
live-coding demo though: I can see the speaker bringing thoughts to life, insisting on what is
important, speeding through boilerplate and showing little experiments "but if I change that thing
over here, then this happens, so that's why XYZ is important."

Live-coding is not easy. And you always face the risk of messing something up and fiddling with
stuff for some very long seconds before finding your way. Nobody wants to watch you debug, live - we
all debug all day long. What we want is code wizardry, the _impression_ that everything makes so
much sense, that it's easy for the person doing it. Yep, they are juggling with 8 torches set on
fire while horseback riding, easy. Surely, there are no horses or torches involved when on my
daily, mundane commute to work with public transport.

But here's a trick. It's mostly a LOT of work. And a few guiding principles which can help a bit.


## Tips and trick


**Know your audience**

Like every conference talk, you should start by defining _who_ you are talking to, what you think
they know or don't know, what you know that they don't - in short, what you can teach them, and how.
Design your talk accordingly.

If you're live-coding something Python at a Java conference, don't go all-in on Python-centric
features (looking at you, `itertools`).

If you're at a Symfony conference, by all means, skip over all the basics of PHP and show them some
advanced features!


**Practice**

Do you know how you juggle 8 torches? I don't know the specifics, but I know you need to practice a
lot. Until you don't need to think about it.

Practice your talk. For a live-coding, depending on the talk, I usually practice it 10 to 20 times
before delivering it - and that's once I have a solid structure in place. I'm not _good_, I've just
failed enough times that I know 99% of what can go wrong, and I can sleepwalk through the code.
But when, occasionally, during the live presentation I stray, and something does go wrong, I can
quickly fix it. Trust me, I have seen this exact error, in this exact place, _multiple times_, and
I know the fix.


**Lay out what you're going to do**

Just like in normal day-to-day coding, you don't start hammering away at a problem. You _think_ it
through, model it, list edge cases. Before you dig into a live-coding, or a live-coding section,
set up this way of thinking for your audience: "this is what I am going to show you, pay attention
to this and that".

For longer stretches of coding, I often lay out a "game plan" in comments:

```java
//  1. Obtain authorization_code
//    a. Redirect the user to their Single-Sign-On provider
//    b. Obtain the authorization_code when they are redirected back
//  2. Exchange authorization_code for id_token
//  3. Read the data the id_token
//  4. Load the data in the session
```

As I code a small step, I can refer back to our game plan, and a ✅ emoji or something.


**Practice again**

No seriously. Until you've failed enough, you should practice. You will build confidence, and for
good reason.

Sometimes you fail and you feel bad. That is what practice _is for_. Enough practice, spaced over
time, will make you (almost) perfect.


**Focus on concepts, not code**

Hot take: code is an implementation detail of a good presentation. Sometimes it's an _important_
implementation detail, mind you. But what attendees want to learn is what can only be read between
the lines: the hypotheses driving a particular implementation, why we choose to do something instead
of something else, how it all fits together, etc.

Some bits of code are important, but you are mostly giving pointers so attendees take note and
explore things in their own time, actually implementing stuff and going through docs.

The reason for doing it live-coding is to mimic real-life situations your attendees usually go
through, build empathy, and entertain the audience by doing it flawlessly.


**Practice more**

I've already mentioned that, haven't I?


**Slow down**

While presenting, make sure to take pauses. Breathe. Let the audience catch up with you, read the
code, take some time to process it and open up the space for questions. I'm often guilty of shoving
too much content within a 50-minute session. That is a VERY long time to be fully alert and absorb
knowledge, even without mentioning the talks folks already attended before coming to yours!

Side benefit: it opens the door for questions, and interactions with the audience, which gives you
immediate feedback on how things are going.

(I won't repeat "practice" but you know I mean it 😀)


**Have fun**

Importantly: have fun! The audience came to have a good time. If you're suffering all the way
through your presentation, they will feel bad for you - not my definition of A Good Time™. Smiling
and laughter are contagious, if you're having fun, you are inviting attendees to share your joy of
coding and making stuff.

As Josh Long puts it "Tech is boring. Make it fun." And also Josh: "make fun of yourself, but never
of others".


## But mostly, a lot of work

All of this will maybe help you, but as you've read multiple times, it's all about the work you put
in. You invest a lot of time into creating an interesting codebase, then crafting a story to tell
around this technical artifact. It takes weeks, sometimes months, to come up with a good story.

And then, practice, practice, practice, until you can do it blindfolded.

Got some praise after my [Carvel talk](https://www.youtube.com/watch?v=Tm2n674Q8aY) at Swiss Cloud
Native Day. As I told folks at the conference: I had rehearsed fully the evening before, twice the
day before that, once more the day before, and probably around 20 times in total. It's _hard work_ to
make it _look easy_.


## You can do it, too!

With enough dedication, and some feedback when you first present your talk, I'm confident that you,
too, can do great.

So, if you're curious and want to try it, go out there, to your local meetup - and take us on your
coding journey. Let's have fun together!
