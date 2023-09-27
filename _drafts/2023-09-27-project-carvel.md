---
layout:     post
title:      "Answering questions about https://carvel.dev"
date:       2023-09-27
categories: [blog]
author:     Daniel Garnier-Moiroux
lang:       en
excerpt:    "Project Carvel is a very neat suite of tools for making YAML
            blobs and then turning those into running stuff on Kubernetes."
---

Last week, I spoke about [Project Carvel](https://carvel.dev) at [Cloud Native Day](cloudnativeday.ch/) 
in Bern, Switzerland 🇨🇭. What a delightful event! Great speaker roster, interesting content, lively
crowd to chat... All brewing together for fascinating conversations. Anyway.

My talk was well received, and ALL of the tools I showcased found supporters and people willing to
try them out. Great feat, considering I showcased 5 out of the 7 tools there are in the Carvel
toolsuite.

I chatted quite a bit about it during the conference, and didn't really take notes. But then an
attendee came back to me with a couple of questions, which I answered in writing.

If you're not familiar with Carvel, this may not make much sense. But a recording of the talk should
be coming up soon 😉

**Disclaimer:** I'm more of an App-Developer than an Ops/DevOps/SRE/Kubernetes-tamer. I mostly write
Java for a living, some Go when forced to and some nonesense on the Internet (hi mom 👋). I do often
have to write some YAML to deploy my apps to k8s, and at work, the components I work on are packaged
with Carvel. In that capacity, I am a _user_ of Carvel, and I can speak about it. But I don't live
in GitOps and declarative infra all day, so I'm not well placed to provide a deep comparison with
Argo or Flux or even Helm.


## Why switch to Carvel from Helm/Kustomize?

Question:

> Where do you see the benefits from using carvel instead of kustomize/helm which already are
> supported e.g. by flux and argocd? Or why should one change to carvel when already using
> kustomize/helm for everything?

First, I do think Helm and Kustomize have their place. Especially if you have already very invested
into the whole ecosystem. I don't think I would do the switch myself. However, you may find some of
the tools useful in addition to what you are already using! Carvel is composable, which is maybe its
most valuable property - find value where you need it, add to your kit, don't try and change
everything, everywhere, all at once!

For example, you want image resolution and pinning, and [kbld](https://carvel.dev/kbld/) is a great
tool for that. Or you want to dip your toes into "RegistryOps", then [imgpkg](https://carvel.dev/imgpkg/)
is here for that (but I see they have something similar in Flux).

Or maybe your Kustomizations are getting out of hand, and could be much more easily expressed with
functions that actually act on the data - e.g. updating part of complex string, which you can do
with [ytt](https://carvel.dev/ytt/).

[kapp-controller](https://carvel.dev/ytt/) is interesting if you want to enable cli-based workflows
for your developers rather than applying raw YAML.

And the three other tools are useful in their own right!


## YTT takes valid YAML as input, why is that useful?

Question:

> What are the benefits still having valid yaml when using carvel? Syntax errors will still need to
> be adressed by a specific carvel linter.

# TODO: raw answer

For the “valid YAML” part of YTT, eh, I’m not sure that’s the most valuable part of it. 

Still, you can do “progressive enhancements”, where you have a valid YAML document that also has extra features in the form of ytt annotations. Imagine a valid Kubernetes object, that you can apply as-is…. but if you run it through YTT, it adds annotations to the object. Helm can’t do that. And that’s not limited to Kubernetes objects as with Kustomize.

It’s still a program though, so you are right that you have to actually run it before you get feedback on whether it is correct (or have a linter but i don’t think this exists).

I like that it refuses to create invalid YAML - I think if you mess your YAML with helm it  won’t tell you. You have to try to apply it before you know it’s a problem. So ytt removes one class of issues - it doesn’t mean it’s a valid k8s object but at least it’s valid YAML!
