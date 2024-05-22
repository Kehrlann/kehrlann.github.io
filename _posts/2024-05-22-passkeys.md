---
layout:     post
title:      "Passkeys: first impressions on WebAuthN"
date:       2024-05-22
categories: [blog]
author:     Daniel Garnier-Moiroux
lang:       en
excerpt:    "I've been implementing WebAuthN to enable passkey support in web apps, here are a few
            impressions."
---

Passkeys have been trending in the past few years. The term was first introduced by Apple in their
2022 WWDC conference. Then we've heard of FIDO. In 2023, more and more passkeys related-talks started
popping up during various conferences. And, in early 2024, the big SaaS and cloud vendors have been
nudging users to use passkeys to login - Okta, Google, Github, AWS...

I gave my own take on a passkey talk in March 2024 [at Voxxed
Zürich](https://www.youtube.com/watch?v=FUWLYC1z1LU), and then in April 2024 with Josh Long at
[Devoxx France](https://www.youtube.com/watch?v=RAuXohxXbAQ). I wanted to do something a bit
different than what I had seen previously: focus on the actual implementation in a real app, rather
than going through slides and explaining all the details.

On top of building a demo app, I've been collaborating with Rob Winch on bringing Passkey support to
Spring Security[^1].

And, friends, after the blood, sweat and tears of integrating passkeys, I have an Opinion™.


## User adoption is still very low

Even at tech conferences, where the crowd is tech-curious and generally in the "early adopter"-ish
cohort, attendees did not really know what to expect about passkeys. At Devoxx France, out of
several hundred folks in the room, less than 50% had even heard of passkeys, and only 2 people
actually used passkeys.

While there is a push from vendors, we are still a long way from the Peak of Inflated Expectations.
Some awareness, but a lot of inertia. Doing a demo using a security dongle (e.g. Yubikey) does not
seem super exciting to developers. However, showing newer stuff like logging in on your Mac with
your fingerprint reader, or using a nearby device, garners a lot more attention.

The flow for logging in with a nearby device goes like so:

1. On their computer, the user navigates to the target website and clicks "log in with a passkey"
2. A modal dialog shows up, and the user selects "log in with a QR code / using a nearby device"
3. Using their phone, the user scans the QR code, and log in using their phone authenticator (e.g.
   FaceID on an iPhone)
4. Wait for a few seconds ...
5. User is logged in on their computer, without having typed any password.

This very portable authentication method has quite the "wow effect". I do think that, over the long
term, this technology will catch on, because it is _convenient_. The added security is just a nice
added bonus.


## The "consumer vs entreprise" tension

There seems to be some tension in the use-cases for passkeys. Members of the FIDO alliance, such as
Apple, want their **F**ast **ID**entity **O**nline for consumers: widespread adoption, ease of use.
Vendors of security solutions, such as Yubikey or entreprise-grade password managers, want extreme
extensibility with many security checks built-in.

Those use-cases are at odds: you can't have something simple that is also infinitely extensible. And
so the developer API for integrating passkeys is unspeakably complicated.


## The WebAuthN API is ... 😱️

The [WebAuthN spec](https://www.w3.org/TR/webauthn-3/) specifies how to access authenticator-bound
credentials ("publick key credentials") from Javascript code, and how to validate the signatures an
authenticator produces. Simply put, it's the bit of JS code that opens up the "sign in with a
passkey" window.

The spec is extremely complicated. The current "stable" recommendation is from 2021 ; and the
current "live" draft, v3, is from 2023. It's not fully stable. It is not trivial to understand what
the browsers actually implement vs what's in the spec.

On top of this the API is ... well ... a W3C API. Arcane and complicated to implement. And doing
the server-side crypto is absolute bonkers - decoding some binary reprensentation of your payload
from [CBOR](https://datatracker.ietf.org/doc/html/rfc7049) encoded data, extracting a complicated
[COSE](https://datatracker.ietf.org/doc/html/rfc8152) key (COSE stands for CBOR Object Signing and
Encryption, here's some more CBOR for you 🤯️), and then validating data scattered across multiple
properties, and storing all of it ("just in case").

Fortunately some brave souls have implemented libs for your to consume the data, such as
[webauthn4j](https://github.com/webauthn4j/webauthn4j). That lib powers nothing less than Keycloak,
and it is maintained by ... [a single
contributor](https://github.com/webauthn4j/webauthn4j/graphs/contributors) (it had 3 commits from
external contributors since jan 2023). The Yubico Java implementation is [not much
better](https://github.com/Yubico/java-webauthn-server/graphs/contributors).

This is worrying for the state of the ecosystem.


## Where do we go from here?

I'm not sure. For WebAuthN to catch up, and for passkeys to be more than just a "big SaaS" player
thing, we need a lot of stubborn folks implementing it, and pushing the needs forward...

The Spring Security team is working hard on releasing something usable and customizable. It will
require some work to move beyond the "default experience" we provide, but by providing Passkey
support, you'll help move Passkey support forward.


---

[^1]: Rob did all the hard work. I've only provided feedback, along with the occasional design and
    API discussion.

