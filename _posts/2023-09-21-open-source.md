---
layout:     post
title:      "Getting into Open Source"
date:       2023-09-21
categories: [blog]
author:     Daniel Garnier-Moiroux
lang:       en
excerpt:    "How I got into Open Source, and how you can, too!"
---


I had an interesting conversation with [Nate Schutta](https://twitter.com/ntschutta), engineer,
teacher, colleague and developer advocate extraordinaire. I was invited on the
[Between Chair and Keyboard](https://www.youtube.com/watch?v=d08NP0r4_ls) podcast, and Nate asked:
"by the way, how did you get into open source?"

I took a while to self-reflect, unsure how it happened. I had wanted to participate into open source
for a while, but one day I finally stumbled into it by accident.


## How it started

For me, it all started by fixing a "bug" in a lib I was using at the time[^1]. That lib was
working fine on our local machines, but did not work when deploying to Cloud Foundry. It was more of
a helper thing, so we could have tossed it away and done without the lib entirely. But instead, out
of curiosity, I tried finding out how it worked. I was working on a Node app, so the lib was right
there, in my `node_modules/`. To my surprise, it was only 150 lines of code! Absolutely zero
friction understanding how it works. And after reading the code, the workaround was obvious. But
hey, why stop there, and why not try to fix the issue? In the issue trakcer of the repo, someone
else was having the same problem, but on Heroku, so this would benefit at least one other person.

It took me five (yes, 5!) months to get this merged in, for roughly 25 lines changed. First, the
maintainer required tests. The tests for that specific feature were complicated to write, with no
good examples in the existing test suite. Second, I didn't understand all the context around why
things were the way they were. It took a little bit of stubbornness to get it through, but I had
feedback from the maintainer, and was encouraged to move forward.

It was an illuminating experience.

It changed my perspective on all the libs and tools I was using. I started seeing small bugs in
things I used in a different light. Small opportunities for improvements, here and there. "Why does
this behave this way?" Just look at the code. Figure it out. And almost every time, it was a small
codebase, less than 1000 lines.

A few examples:
- A [git-duet PR](https://github.com/git-duet/git-duet/pull/83) (golang, bash) where the tool
  clashes with existing git hooks. Before submitting the above, I struggled with their testing
  toolkit a bit, so I submitted a [PR with small improvements](https://github.com/git-duet/git-duet/pull/80)
  in the testing setup.
- A [connect-typeorm issue](https://github.com/freshgiammi-lab/connect-typeorm/issues/19)
  (javascript), explaining the problem, discussing how we worked around it, and different ways to
  fix it. To help demonstrate, I submitted a
  [PR with a sample test](https://github.com/freshgiammi-lab/connect-typeorm/pull/20).
  I like this example, it shows that issues and discussions are at the core of open source, not just
  code! And when you don't really understand the implicits of a project, discussing with a
  maintainer sets everyone up for success.
- For an upcoming conference, I'm using [maaslalani/slides](https://github.com/maaslalani/slides) to
  write my slideshow. Some formatting things didn't work the way I wanted, so I cloned the code,
  changed it, and made a custom build just for myself. Guess what? Other folks on the issue tracker
  want something similar. PR opportunity right there! Rather than hardcoding values to fit my
  specific needs, I changed the way the config is loaded, so that other folks can use it too.


## Small projects, big projects

It's much easier to get into those smaller projects than the big names that you might know, your
Linuxes, Postgreses, Chromiums, Reacts or Springs.

First, there's less code. So there's much less technical context to build up, and you can understand
how this piece of code works fairly quickly, without missing important edge cases. It's easier to
make a change, run tests, run a build, and use the newly created artifact to see the impact of your
change, in practice.

Second, the roadmap is usually pretty clear. There may be a few open and closed issues in the
project's tracker, you can look at the past few months of commits, and get a rough idea of where
things are coming from, and if the project is quite active, where things are going. You won't be
missing the "bigger picture". Maintainers of big projects are often teams, sometimes funded by
companies. They know where they want the project to be in 6 months to 2 years, they have a deep
understanding of the ramifications a change could have. But you... You don't. So you may be working
in vain because what you want is not what the project wants.

Smaller projects are great way to learn to adapt to new languages, codebases and techniques. You can
experiment, even if you're unfamiliar with the environment. But they are also great to get attuned
to the implicit rules of a project you don't know. Code is a socio-technical construct, and
maintainers are "peopleware". They value some things more than others, have their own sets of
interests, their own communication preferences. Understanding those are almost as important as
understanding the code: maintainers have the final word, they will accept or reject your
contributions, they can decide whether to work with you or ignore you completely. Building the
initial trust is essential, and once that trust is established, further contributions are much
smoother. Smaller projects are great training ground to ramp up those peopleware skills.


## Getting into a Big Project™

For bigger projects, the easiest way in is to get introduced by a maintainer. Find them at a
conference, a Hackergarten or similar "let's contribute to Open Source yay!" event. They will be
able to onboard you, tell you where to start, and point the misunderstandings you may have about how
the project works. You'll get direct and fast feedback about the implicit rules of the project
you're missing. I've been lucky enough to be onboarded into Spring Security this way, which in turn
opened the door to the broader Spring portfolio. But getting that lucky is rather rare.

The more involved way to getting into the project is to follow the issue tracker, and contribute
there: answer questions, participate in discussions, open your own issues if you have (new and
unreported) problems. Think about how you would fix those. Read the code that is merged to fix the
issues, and see where you guessed right and where your solution is too far from what was actually
implemented. Patiently gather context, and build credibility with the maintainers.

One day, you'll find an issue that you have a good understanding of, and you'll have an idea for a
solution. Let the maintainers know, in the issue tracker, that you're interested in submitting a PR.
They can validate your understanding. Provided that they are open to this, open the PR early, with a
proof of concept to demonstrate your design, and polish it once you've gotten feedback.


## Closing thoughts

A few caveats before wrapping up:

This reflects my own journey, it is very anecdotal evidence. I haven't surveyed many developers
about how they got into open source, so take my words with a grain of salt. Or two.

I've been lucky enough to stumble into nice and welcoming communities. I imagine some were not as
fortunate. Similarly, I do recognize that for some folks, there are huge biases working against
them, gatekeeping and social barriers to entry. I had to face none of those.

And finally, while I do contribute here and there, I don't maintain "my own" projects. I've joined a
project as a maintainer in the past, and it is a lot of work. And I mean a LOT. There's some code of
course, but also a lot of support and discussing with users.At this point in time, I can't invest
the energy required. So beware, if that's not what you are looking for.

With that out of the way: I wish _you_ the best of luck, and tons of fun!




[^1]: The [PR is still on GitHub](https://www.youtube.com/watch?v=d08NP0r4_ls), if you're curious 
