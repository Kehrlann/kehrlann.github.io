---
layout:     post
title:      "Teaching: start with the big picture"
date:       2024-07-03
categories: [blog]
author:     Daniel Garnier-Moiroux
lang:       en
excerpt:    "When you're an expert in something, it's easy to overwhelm newcomers with too many details."
---


In software engineering, like in most human endeavors, it's all about the details. The philosophical
argument crumbles when a particular detail of the premise is wrong. The mayonnaise won't form if the
ingredients are not mixed at room temperature. The server won't accept connections if the listen
address does not match the address of the incoming request.

Devil is in the details - but before chasing the devil, one must first be sure that they actually go
anywhere at all.


## Boxes (too big) and arrows (unlabelled)

When introducing new concepts to someone, one must first give them a bird's eye view of the context,
the landscape around the problem, if you will. I've been explaining [OAuth2](https://oauth.net/2/) a
lot lately, and it's a perfect illustration of starting very general and then zooming in, into
different aspects.

The original [RFC6749](https://datatracker.ietf.org/doc/html/rfc6749), published in 2012 (!!) is 76
pages long. And it's only one out of ~too many~ [quite a few](https://oauth.net/specs/). To explain
this simply, I have to start very large. Pick the most common flow (out of 3, up to 7 depending
on how you count), explain what we're trying to accomplish (**Daniel** grants access to
**photos.example.com** to his **Google Photos album** without ever sharing his Google credentials),
who the different parties are in the protocol, and how this is generally achieved. And that's it.
Don't explain the `authorization_code`, don't mention `client_credentials`, don't go into the
details of `scope`s.

Of course, this first explanation is awfully wrong: it leaves many things out, and it is full of
blissfully incorrect statements (e.g. **Daniel** gets a token from **Google** and shares the token
with **photos.example.com**). But the point here is not to be complete, or even correct. It's to
draw the first boxes and arrows connecting them, even without a proper legend or labels.

I'm conveying the _vibes_, the _feels_ of this whole OAuth2 thing.


## Higher resolution

And then I can slowly increase the resolution of the initial picture. Add details on how things
actually work. Challenge the initial understanding the learners are trying to get familiar with (I
told you that Daniel gets a token from Google, but think about it: when you log in to a third party
website using Google, do you start by going to Google?)

But this must happen with a purpose, one touch at a time. I never go too deep, or try to give all
the context. It's always tailored to the audience, what they are trying to achieve, or what they
need to learn to broaden their perspectives.

And then, the learner needs to zoom in by themselves, finding the rough edges, building their
own experience-based context before coming back with questions.


<br>

Soon, the initial boxes-and-arrows diagram will be relegated to the bottom of the knowledge pile,
where it will be forgotten. It was just a trick, a stepping stone, nothing more.
