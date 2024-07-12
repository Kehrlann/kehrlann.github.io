---
layout:     post
title:      "Thoughts on using JetBrains fleet"
date:       2024-07-12
categories: [blog]
author:     Daniel Garnier-Moiroux
lang:       en
excerpt:    "I started using Jetbrains' Fleet editor. Here are some intial thoughts: it's nice."
---

I've been playing with Jetbrains' [Fleet editor](https://www.jetbrains.com/fleet/) in the past
couple of weeks, and I've been pleasantly surprised!

I've had to write some JS for WebAuthN / passkey support in Spring Security, and so I needed an
editor for that. My daily driver is IntelliJ for Java (and Go when I have to), and, while I know I
can do my JS in there (or in Webstorm), I thought it was time to try something else. My daily driver
for text-based editing is Neovim[^1], and I tend to fall back to Visual Studio Code when I have to
do multi-file editing or code-related stuff that's not Java, such as Python.

I had tried Fleet a bit when it came out two-three years ago, but it didn't click for me. It may be
a bit silly, but I missed the smooth caret movement from VS Code 😅️ I had a general feeling that VS
Code was, I don't know, snappier? But it's been quite a while, so time to try it out again!


## The good

Remember, I live, I breathe IntelliJ. I opened the editor, selected the "IntelliJ" key bindings...
And boom, it was just like home. It feels very Jetbrains-y in its layout, the way it thinks about
different panes and how to access them - no need for a new mental model, that's a plus.

Most importantly, it _Just Works™_. It picks up the JavaScript file, shows you syntax errors, helps
with autocomplete (as much as possible - it's JavaScript after all) and generally does what you
would expect it to do.

There's this "smart mode" that allows you to do programming-related tasks, beyond text editing, and
it's really, really smart. For example, I'm writing my tests using Mocha, complete with their
lingo `describe(...)`, `it(...)`, etc. I press `Ctrl Shift R`, and it runs my tests. No
configuration required, no settings to enable stuff, no plugin, it just works.

The formatting uses `prettier` and gives you predictable, standard JS formatting.

The general editor is discoverable: open the command palette, type familiar words you know from
IntelliJ, and you'll find the commands you're looking for. The settings has a simple search bar that
allows you to find stuff, and since there are not too many options, you don't spend hours pondering
how to make it do what you want.

I'd say the general "Out of the Box" experience is much nicer than VS Code, I don't have to deal
with plugins, wonder why there 200 of them that seem relevant, configure a linter when I try to
format, etc. Great first contact!


## The not-so-good

Nothing is either "bad" or "ugly" in Fleet, no deal-breakers. Mind you, it's not perfect and has
its share of "not-so-good" items.

While it's discoverable, it's only to a point. Some features are missing, e.g. "go to next splitter"
when you use multiple editing "splits", and it's not 100% clear at first whether it's not there or
you are doing it wrong. I guess not everyone comes from IntelliJ, so the experience is not "IntelliJ
but different" and you do have to put in a little bit of work to understand all the things you can
do.

Running a test was easy, but making a "configuration" to run all my tests was kind of shooting in
the dark - the docs tell you about [JavaScript run
configurations](https://www.jetbrains.com/help/fleet/javascript-run-configs.html), but only list
`npm`, `node`, `jest` and `nodeAttach`. Lo and behold, there's an undocumented, un-discoverable
`mocha` config type that ... I made up? Found on Stack Overflow? Can't remember. For the record, it
looks like so:

```json
{
    "configurations": [
        {
            "type": "mocha",
            "name": "Run all tests",
            "file": "test/",
        },
    ]
}

```

In general, the documentation is quite lackluster. For example,
[Prettier](https://www.jetbrains.com/help/fleet/getting-started-with-javascript.html#prettier) is
used for code formatting. You can configure prettier in many ways (e.g. with `.prettierrc`,
a `prettier` key in `package.json`, ...), but only some configurations are supported by Fleet, and
that's for you to discover.

Some stuff feels less polished too - the directory I work in happens to have a `build.gradle` file
to orchestrate the `npm` build as part of the bigger project. But that is not what I use during my
JS development. Smart mode has decided that it's a Gradle project and wants to import it, but it
lacks the rest of the project config, the wrapper, etc. And Fleet won't let me exclude this
unrelated java artifact from my project (or at least I haven't found how). So now I'm stuck with
this "can't import Gradle project" error that pops up once in a while and that I can't fix.

It also had this weird behavior, every time I used the "Go To" command `Cmd O` to open a file, it
opens a new tab with this file. So when I navigated with this, I ended up with the same
tab open ten times... But that seemed fixed this week, so at least things are moving fast!


## Verdict?

I like it. I think for basic stuff, I like it more than VS Code and its plugin hell. For complex
project, I'll probably switch to a full-fledged editor, Webstorm or Pycharm, but for my small,
simple project, it's been quite nice.

Now, the elephant in the room - could it displace VS Code? I don't think so, Visual Studio is
already too entrenched, you can customize it any way you like, it's used everywhere, even in your
browser... So it's probably a tough hill to climb for the new-ish kid on the block. But Fleet could
be the base for Jetbrains' next generation of IDEs, so I'm not too worried about its future.

My thoughts? It's been fun to use, so give it a spin!

<br>


---

[^1]: I'm writing this blog post using [Neovim](https://neovim.io/)! It like vim, but, I don't know,
    slightly more modern. I have to confess I don't know vim enough to confidently tell them apart
    🤫️ If you want to learn vim, the best recommendation I have is the [Practical
    vim](https://pragprog.com/titles/dnvim2/practical-vim-second-edition/) book. The book doesn't
    try to explain all of vim, but instead presents a cookbook of things you can do, how to do it
    "the vim way", and progressively exposes you to the mindset you need to use vim. One of the best
    tech books I've ever bought.
