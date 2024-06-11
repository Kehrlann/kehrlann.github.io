---
layout:     post
title:      "OAuth2 and OpenID token expiration"
date:       2024-06-11
categories: [blog]
author:     Daniel Garnier-Moiroux
lang:       en
excerpt:    "Token expiration or \"time-to-live\" is out of scope for OAuth2 and OpenID spec. What
            should you pick?"
---

A somewhat frequent question in the OAuth2-and-or-OpenID field is "how long should my access/refresh
tokens last?", or, in other word, what should I set as an expiry time? The question often contains
the dreaded terms, _Best Practice™_.

It's an excellent security question. Like all excellent questions, the answer is (spoiler alert) _It
Depends™_. After all, if there was a unique, simple _Certified One True Best Practice™_ answer, we
wouldn't be asking the question, would we?


## It depends

In order to answer the question, we should start by assessing the security implications, think about
our threat modelling and our overall security posture. A few points we could think about:


### Are `refresh_token`s treated differently than `access_token`s?

`access_token`s are considered not-super-duper-safe[^1], and recommendation are usually to keep them
with a low-ish expiry. `refresh_token`s, on the other hand, have a longer expiry, and they are
considered "sensitive" credentials, that MUST be stored "confidentially":

> Refresh tokens MUST be kept confidential in transit and storage, and
> shared only among the authorization server and the client to whom the
> refresh tokens were issued.  The authorization server MUST maintain
> the binding between a refresh token and the client to whom it was
> issued.  Refresh tokens MUST only be transmitted using TLS as
> described in Section 1.6 with server authentication as defined by
> [RFC2818].
>
> RFC6749 - [Security Consideration > Refresh Tokens](https://www.rfc-editor.org/rfc/rfc6749.html#section-10.4)

There are no details about what "confidential storage" mean exactly, but it's easy to imagine that
it means, at least, "dont' store them like you store your access tokens". So if we store them
together, with the same security protection, that's one less reason to have different expiration
times - or even have refresh tokens entirely.


### Are there specific security concerns around the access tokens?

Maybe we want to have "soft revocation", with short lived access tokens. That happens if we don't
support true revocation, but we want to make sure that they can be somehow rejected by consumers if
they're not "valid". The definition of valid could be "was issued not too long ago, so less likely
to have been leaked and then re-used".

Or maybe the access tokens are visible in a user's browser for some reason, and that opens up a few
attack vectors. Or they are sent to low-trust resource servers that could leak the tokens.

In that case we want to harden our posture and trust those credentials as little as possible, set a
a time-to-live in the low minutes. We consider that when there's a problem with a token, at least it
cannot be used for a long time. It's obviously not sufficient for security-critical apps, or
sensitive data, but it might be enough for less cirtical use-cases.


### How often does the user data change?

When use a JWT token, it bears all the authorization data, and so we are probably not doing token
introspection on every request. If we want our tokens to be an accurate representation of our user
data, we want either 1) the data to not change frequently or 2) our tokens to be short lived, so
incorrect information does not linger for too long.

This is the case for the access tokens, which contain the user information such as the subject
identifier (aka `sub` claim) or scopes. But, depending on your authserver implementation, it might
also be true for refresh tokens. In some cases, the authserver does not re-check the user data when
exchanging a refresh token for an access token, but use a cached version of the access token that
was initially accessed. In that case, refresh tokens should be short-lived too, to ensure a new
"token creation context" is created for that user.


### What about offline access?

Does the app need offline access to the Resource Server, when the user is not interacting with the
app, e.g. to sync stuff periodically in the background? Otherwise, if we expect the user to be
present, how long is a user session, and how long can they be inactive for? Do we expect the user to
use the app absolutely transparently after a few days of inactivity (e.g. no blinking screen for
re-authorization)?

For non-offline access, a short-ish refresh token, from 1 to 12 hours, can often be enough. This
means re-logging in after the week-end, but, hey, Mondays are for checking e-mail, coffee breaks and
SSO login anyways 🙃️


### What happens when the token expires?

Is token expiry a problem for our users? Or is our SSO system set up in a way that obtaining a new
token is transparent as long as you're logged in to the auth server?

If the inconvenience is very minor, then it might be cheap to err on the side of short expiry and
frequent token re-issuing, making it harder to use old tokens that may have leaked.


### What's the worst case scenario, when a token gets leaked?

What if an access token gets leaked? What about refresh tokens? What's at risk? What's the blast
radius? Do we have proper mitigations to make sure that systems are well isolated and that a token
stolen from system A can't be used with system B (e.g. audience checks, certificate-bound tokens,
...)

The higher the risk, the shorter the expiry.


### What's the trust level our app operate in?

Who can request credentials from the authserver, and how are these credentials secured? Is it an
internal, well controlled corporate environment, or the Scary Open Internet™? And what about the
resource servers, are they trusted applications, or can anyone spin up an app and start collecting
access tokens, with no guarantees and almost no auditability?

In a high-trust environment, we can afford longer-lived access tokens - we could even imagine doing
without refresh tokens, depending on our constraints. In a low trust environment, access tokens are
an environmental hazard that we need to dispose of quickly.


### Are there latency, bandwitdh, availability or load issues?

How much do we care about hitting the auth-server frequently? Should we be conservative and make
sure that we are fault tolerant when the auth-server goes away for some time? How conservative do we
need to be with our auth server CPU and all those computationally expensive
crypto-signing-shenanigans? How many apps are hitting our auth server with requests in parallel?
What about peak times? (oh hey, good to see you again, Monday morning 👋️)

Short expiry means more traffic, sometimes two orders of magnitude more traffic. The operational
burden for the team running the authserver can be a factor, toppling your central identity provider
is never good news.


## tl;dr: Tradeoffs! Tradeoffs everywhere!

Back to our main point: it's all tradeoffs.

Shorter-lived tokens are better for security, especially the access tokens who get passed around.
Refresh tokens have a higher impact, and the expiration must match the security posture, who they
are issued to, how they are stored, etc. Longer-lived tokens make for lower resource usage, and
generally for better end-user experience, with less redirects, flashing blank screens and
password-typing.

As with in all things related to security, before making decisions, we MUST[^2] think carefully
about the environment we operate in, possible threats and impacts. We also need to consider what we
gain by relaxing security constraints, and how much those gains are worth in terms of risk.

<br>
<br>

---
[^1]: Non-official technical term.
[^2]: Haha Daniel you RFC nerd.
