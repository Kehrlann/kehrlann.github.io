---
layout:     post
title:      "CS101 Intro: to my engineering students"
date:       2021-03-24
categories: [teaching, computer science]
author:     Daniel Garnier-Moiroux
lang:       en
excerpt:    "To my 3rd-year engineering students: what you'll be learning
            in this class, what you will NOT be learning, and why."
---

As I may have mentioned before (or not?), I teach Computer-Science-slash-Software-Engineering classes at my "alma mater", [Mines ParisTech](https://www.minesparis.psl.eu/), in Paris, France. This engineering school system is a French educational idiosyncrasy[^1].

Our "average" student, bright and smart, very good at getting great scores on maths tests, is thrown for the first time into a "pick your own adventure" type of education. And they're forced to go through intro courses that they may or may not be interested in, ranging from "I'm passionate about computer stuff" to "computers hate me, and I hate them back". Courses such as basic economics, mechanical engineering or the one I teach, Computer Science-Software Engineer. I get a group of 20 students and have to teach them the basics of programming and CS. I've given that course twice, once in Java and once in Python. I'm finally getting a better idea of what I would like to tell my students before I start the class.

## What this class is about

First and foremost, why are you here? As you may have heard, [software is eating the world](https://a16z.com/2011/08/20/why-software-is-eating-the-world/). And this trend does not seem to be going away anytime soon. Everything in our lives will run with the help of one or many computer programs: your communication means, your car, your phone, your dishwasher, your taxes, your pacemaker, litterally everything in your workplace. Throughout your career as an engineer or a manager, it is extremely likely that you'll run into pre-packaged software products and/or custom-built software. Either as a user, an author, a contributor, a team lead, a stakeholder, you'll have a part in it. So we figured it'd be worth it to have a peek at how it is built. This class will hopeful show you that you _could_, given you put your mind to learning it, build software. You'll get to know the basic concepts by practicing them, and hopefully you'll learn how to learn by yourself, using publicly available resources.

We also want to give you a taste of more Computer-Science-y type of problems, talking about data structures and algorithms, and a few theoric bits behind it - but not too much. Just dipping your toes in the water. Who knows, some of you might even like it!

And it should give the tools for writing quick scripts that will help you automate whatever you need to automate your job - parsing files, sorting stuff, answering questions about said data, etc. We want you to know enough to where to start, install whatever you need to type out a program and run it.


## What this is not about

We are _not_ going to make you full-fledged software engineers. In fact, we will try and present a few rough ideas for going beyond one-off scripts, but you would need a lot more practice to actually write software in any professional capacity.

Similarly, we're not teaching you to be computer scientists. While there will be some theory, we will not go deep into fundamentals, rehearse every core data structure or practice variations of famous algorithms.


## It may be a bit painful

So this class will be a mix-and-match of things, that could be quite complicated. We'll do some plumbing by installing enough of a dev environment on your machine - we want you to be able to start from scratch and not be lost outside of the lab.

And modeling the world in terms of abstract "trees", "graphs", "links" and "nodes" might not click for everyone. Try and stick to the letter of the exercise when you don't "get it". Usually when it says "put the _node_ in the _queue_" it means something like `queue.append(node)`, not `queue.append(value)` or whatever.


## Grading

With that in mind, here's how we will grade your work. Before every class, we will have a simple quizz, reviewing the notions the we went through in the previous week. Every week we'll hand out lab assignments, which we will collect through GitHub and make a simple quality assessment. Remember to always turn in your assignments, even incomplete. They must AT LEAST work without syntactical errors.

We will finish the semester with a take-home exam, a problem that you will have to solve using the tools you will have acquired - don't worry, we will be here to answer questions and offer guidance when you're working on that project! That exam will have automated tests that will amount for half of the points, and the remain half will be qualitative review of your work (readability, reusability, use of relevant datastructures, etc). So you should be able to get a good sense of the exam grade you'll have - if 0 tests pass, that a maximum of 10/20 on the whole exam. 

We'll make a weighted average of these. The exam will make up the majority of the final grade, then lab work, then quizzes.

---

[^1]: For those of you that don't know the French education system, this "engineering school" comes after two years of "prep school" where you toil away doing 10 to 15 hours of math a week, same in physics. Then you take a few exams, and depending on your rank you get into these schools. They may have specialties, for example Supaéro students study aeronautics-related stuff, while others may be more "generalist schools", like Mines. In that case, you go through a bunch of management-adjacent classes, of you get through intro classes into various fields, and then you choose a major, such as logistics, innovation sociology, quantitative finance, IT management or geology (this originally being the school of Mines, after all). After three years, they'll get a Master's degree.


