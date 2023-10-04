---
layout:     post
title:      "Musings about project Carvel"
date:       2023-10-04
categories: [blog]
author:     Daniel Garnier-Moiroux
lang:       en
excerpt:    "Answering questions about Project Carvel, a very neat suite of
            tools for making YAML blobs and then turning those into running
            stuff on Kubernetes."
---

Two weeks ago, I spoke about [Project Carvel](https://carvel.dev) at [Cloud Native Day](https://cloudnativeday.ch/)
in Bern, Switzerland 🇨🇭. What a delightful event! Great speaker roster, interesting content, lively
crowd, engaging folks... All brewing together for fascinating conversations. Anyway.

My talk was well received, and every single one of the tools I showcased had people willing to try
it out. Great feat, considering I showcased 5 out of the 7 tools in the Carvel toolsuite. It shows
the value of the Unix philosophy applied to Kubernetes tooling - there's something for everyone!

I chatted about Carvel with attendees during the conference, and didn't really take notes. But then
someone came back to me over email with a couple of questions, which I answered in writing. Here's
a cleaned up version of the my answers.

If you're not familiar with Carvel, this may not make much sense. So it might be a good idea to take
40 minutes and go watch [the talk on YouTube](https://www.youtube.com/watch?v=Tm2n674Q8aY) first.

**Disclaimer:** I'm more of an App-Developer than an Ops/DevOps/SRE/Kubernetes-tamer. I mostly write
Java for a living, some Go when forced to, and sometimes stuff on the Internet (hi mom 👋). I often
have to write some YAML to deploy my apps to k8s, and at work, the components I work on are packaged
with Carvel. In that capacity, I am a _user_ of Carvel, and I can speak about it. But I don't live
in GitOps and declarative infra all day, so I'm not well placed to provide a deep comparison with
Argo or Flux or even Helm.


## Why switch to Carvel from Helm/Kustomize?

Question:

> Where do you see the benefits from using carvel instead of kustomize/helm which already are
> supported e.g. by flux and argocd? Or why should one change to carvel when already using
> kustomize/helm for everything?

First, I do think Helm and Kustomize have their place. Especially if you have already invested in
the whole Helm ecosystem. I don't think I would do the switch myself. However, you may find some of
the tools useful in addition to what you are already using! Carvel is composable, which is maybe its
most valuable property - find value where you need it, add to your kit, don't try and change
everything, everywhere, all at once.

For example, you want image resolution and pinning, and [kbld](https://carvel.dev/kbld/) is a great
tool for that. Or you want to dip your toes into "RegistryOps", then [imgpkg](https://carvel.dev/imgpkg/)
is here for that.

Or maybe your Kustomizations are getting out of hand, and could be much more easily expressed with
functions that actually act on the data - e.g. updating part of complex string, which you can do
with [ytt](https://carvel.dev/ytt/).

[kapp-controller](https://carvel.dev/ytt/) is interesting if you want to enable cli-based workflows
for your developers rather than having them applying raw YAML.

And the three other tools are useful in their own right!


## ytt takes valid YAML as input, why is that useful?

Question:

> What are the benefits still having valid yaml when using carvel? Syntax errors will still need to
> be adressed by a specific carvel linter.

That's an interesting question. When I talk about YAML correctness and ytt, I mean multiple things.

First, it means ytt won't process and invalid YAML program and that it is indeed processing YAML
structures, not raw text.

The following is not a valid ytt program, because it's not a valid YAML document:

```yaml
foo: 42
    bar: 1337
```

Trying to process that with ytt will throw an error, e.g.: `ytt: Error: Unmarshaling YAML template 
'example.yml': yaml: line 2: mapping values are not allowed in this context `

So the feedback is really fast, compared to a text-processing engine which may produce invalid YAML,
which then gets rejected by a later program, like kubectl.

Second, a full ytt program, with annotations, is valid YAML document, even if it does not make a
ton of sense. Consider the following example:

```yaml
#@ load("@ytt:data", "data")

#@ def app_configmap(app_name, app_html):
apiVersion: v1
kind: ConfigMap
metadata:
  name: #@ app_name
  namespace: default
data:
  index.html: #@ app_html
#@ end

#@ for/end app in data.values.apps:
--- #@ app_configmap(app.name, app.html)
```

This is a valid ytt program, and a valid YAML document. In fact, if you feed it into `yq` and strip
the comments, you get yaml back:

```yaml
# run `yq '... comments=""' example.yml` and get the following output:
apiVersion: v1
kind: ConfigMap
metadata:
  name:
  namespace: default
data:
  index.html:
---
```

The example above is not super useful as is, but one could imagine a way of doing progressive
enhancements, by adding things only if the document is run through ytt:

```yaml
#@ load("@ytt:data", "data")
#@ load("@ytt:template", "template")

#@ def annotations():
#@  return {
#@    "annotations": {
#@      "kapp.k14s.io/versioned": "",
#@      "kapp.k14s.io/versioned-keep-original": ""
#@    }
#@  }
#@ end

---
apiVersion: v1
kind: ConfigMap
metadata:
  name: my-website
  namespace: default
  #@ if "kapp_support" in data.values:
  #@ template.replace(annotations())
  #@ end
data:
  index.html: Hello world!
```

If you apply the above to a kubernetes cluster directly, or run it through yq, you get a very simple
`ConfigMap`:

```yaml
# run `yq '... comments=""' example.yml` and get the following output:
apiVersion: v1
kind: ConfigMap
metadata:
  name: my-website
  namespace: default
data:
  index.html: Hello world!
```

But applying ytt with `--data-value kapp_support=True` yields a different output:

```yaml
# run `ytt -f example.yml --data-value kapp_support=True` and get the following output:
apiVersion: v1
kind: ConfigMap
metadata:
  name: my-website
  annotations:
    kapp.k14s.io/versioned: ""
    kapp.k14s.io/versioned-keep-original: ""
data:
  index.html: Hello world!
```

That example is simple but showcases a `ytt` program that is useful even distributed as "raw" yaml:
it does something, it can be applied to a cluster. But with `ytt` you have more customizations
available.

One can even embed overlays directly in the document for meaningful transforms, all while keeping a
valid "raw" yaml doc. For example, if you want to update the name of the above `ConfigMap`, you can
add the following ytt program - it changes the name of the `ConfigMap` to `updated`. The "raw"
yaml file just has an empty document at the end.

```yaml
#@ load("@ytt:overlay", "overlay")

#@ def some_func(current, _):
#@ new = dict(**current)
#@ new_metadata = dict(**new["metadata"])
#@ new_metadata["name"] = "updated"
#@ new["metadata"] = new_metadata
#@ return new
#@ end

#@ cm = {"kind":"ConfigMap","metadata":{"name":"my-website"}}

#@overlay/match by=overlay.subset(cm)
#@overlay/replace via=some_func
---
```

Very neat, in theory at least. You can't do all of that with just Helm or Kustomize.

> 💡 **Caveat:** I've never actually used this in practice. All my ytt programs run through ytt.
