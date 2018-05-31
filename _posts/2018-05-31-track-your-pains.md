---
layout:     post
title:      "Track your pains"
date:       2018-05-31
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

## There is work to be done, acknowledge it

These pains are a signal that there is work to be done, and the strength of the
signal is the intensity of the pain. Work might be some tests to add to prevent
frequent regressions, some tests to speed up, a deployment to automate. These
tasks often do not provide direct feature value, but are often centered around
developer productivity. They might save a little bit of time everyday, increase
confidence in important tasks, save us some time in the future when we automate
our learnings and don't have to re-discover them in 6 months.

When we choose to ignore these pains and go for a quick fix, without giving it
much thought, we implicitly _de-prioritize_ this work. Which, often times, is
the right thing to do - that's why don't fix things in the first place. A good
practice to avoid this could be to do a write down, say in your issue tracker,
a trello board, a spreadsheet. Summarize your problem in a few words, and
explain in detail how things are how you wish they were (or you wish they were
not). This will help think it through before you decide not to do something.

## Then, prioritize this work

Once you start doing this, you can actively prioritize the work there is to
be done. You can regularly go over your list of pains, talk it through with
fellow engineers and surface the most important ones. You might even want to
invite your product managemenet team to these sessions, help them gain insight
on the health of the codebase, and eventually prioritize some of this crucial
housekeeping over feature backlog. This will also avoid long discussions when
you end up blocked and PM had not seen that coming.

To prioritize work, product practices do some user and business research, and
gather data in general. You should do the same: every time the same little pain
comes back, take some time to update your tracker/trello/spreadsheet, say who
was impacted, when explain how much time and effort might have been wasted over
it. It may well be just a few minutes, but those can easily compound.

Maybe next time, this practice will help you make conscious, explicit and
informed decisions, and not unduly reject work.
