---
layout:     post
title:      "Track your pains"
date:       2018-05-27
categories: [software engineering]
author:     Daniel Garnier-Moiroux
lang:       en
excerpt:    When you develop, as an individual or as a team, you experience
            small pains (flaky tests, rigid architecture, etc.) What do you
            do with those ?
---

Whether you work alone or with a team, when you develop software, you experience
little and bigger pains. Maybe some of our tests are flaky. Maybe the build time
is very long. Maybe the architecture of this component is rigid and is hard to
change. Maybe some critical piece of our infrastructure, say our deployment
machine, crashes from time to time.

## What we usually do

When we experience a catastrophic failure, and often times gear up, assemble the
Avengers and fix the mess at hand - after all, we can't _not_ deploy. Sometimes,
we'll write a nice, formal post-mortem, and devote budget to actually fix the
underlying problem. But that's not always the case, sometimes we go on with our
lives until the next outage. After all, there's feature work to be done, and
deadlines, and angry stakeholders shouting all around.

When it's minor problems, either the fix is a low hanging fruit and we take the
time to fix it, or it's more of an effort, and we choose to ignore it until
next time. Sure this test fails 10% of the time, let's just re-run it !

These pains are a signal that there is work to be done. There even might be a
parallel between the strength of the signal and the intensity of the pain.
When we choose 
