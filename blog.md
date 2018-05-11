---
layout: page
type: home
permalink: /blog
type: blog
excerpt:    Daniel Garnier-Moiroux is a software engineer, tinkerer of things
            and lover of automation. Currently working at Pivotal Labs.
---

<p class="text-justify">
    Hi folks !
    <br>
    <br>
    I'm Daniel Garnier-Moiroux, and you are currently visiting the blog
    where I rave about my craft, software development. Here you will find
    technical stuff along with thought pieces about projects, business, HR, etc.
    Some of them will be in French, some in English. Some content is quite old now,
    so be warned, quality may vary.
    <br>
    <br>
    Have a great read !
</p>

<h1>Articles</h1>

<ul>
    {% for post in site.posts %}
    <li>
        <span>{{ post.date | date: "%d / %m / %Y" }} :&nbsp;</span>
        <a href="{{ post.url | prepend: site.baseurl }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ul>

<p style="margin-top:20px;">Subscribe <a href="{{ "/feed.xml" | prepend: site.baseurl }}">through RSS</a>.</p>
