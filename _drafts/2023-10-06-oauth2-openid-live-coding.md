---
layout:     post
title:      "SSO live conding follow up"
date:       2023-10-06
categories: [blog]
author:     Daniel Garnier-Moiroux
lang:       en
excerpt:    "Answering questions about OAuth2 and Openid."
---

I did a live-coding demo of how to implement SSO at earlier this month. You can find the recording
on the usual [Youtubes](https://www.youtube.com/watch?v=wP4TVTvYL0Y). By "SSO", I mean basic OpenID
Connect and OAuth2 clients. I got a few questions after the talk, so I wanted to record my answers.
But first, a few thoughts on OAuth2.

## OAuth2 is complicated

If you've ever come close to OAuth2, you've probably been put off by the SSO


## Can someone "steal" my app's `client_id` for an attack?

In the demo, I register a client with a redirect URI, `http://localhost:8080/oauth2/callback`. T

- attack using my client_id, using localhost?
- JWTs vs opaque tokens?
- front-end patterns?
    - With Spring Cloud Gateway?
