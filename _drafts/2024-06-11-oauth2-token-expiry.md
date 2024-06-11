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





# TODO
# TODO
# TODO
# TODO
# TODO
# TODO
# TODO
# TODO
# TODO
# TODO
# TODO
# TODO
# TODO

---

[^1]: Non-official technical term.

