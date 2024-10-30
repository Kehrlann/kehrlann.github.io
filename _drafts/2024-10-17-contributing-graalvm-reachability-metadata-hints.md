---
layout:     post
title:      "Contriubting GraalVM reachability metadata"
date:       2024-10-17
categories: [blog]
author:     Daniel Garnier-Moiroux
lang:       en
excerpt:    "Contributing to the graalvm reachability metadata repo and other adventures"
---

I've been contributing to the [


GraalVM native-image compiler is pretty smart and is capable of figuring out what kind of code
should go in a native image. It has [some limitations]()


Ok so the goal is to generate [Reachability
Metadata](https://www.graalvm.org/latest/reference-manual/native-image/metadata) - currently in the
form of 5 files:
- reflect-config.json
- proxy-config.json
- serialization-config.json
- resource-config.json
- jni-config.json

(Note that the format will change in the future and be in a single file,
`reachability-metadata.json`, but for now, stick to the multi-file format)

I _think_ you only care about reflect-config and resource-config. Now these files can go either in
the shipped library itself in `META-INF/native-image/org.testcontainers/testcontainers`, in the
reachability metadata repository (maintained by Oracle and published infrequently), or in the
user's project (and that's what we're trying to avoid). We want to including the meatadata in your
repo, because the Oracle feedback loop is just too slow.

That metadata can be hand-crafted, or collected using the [tracing
agent](https://www.graalvm.org/latest/reference-manual/native-image/metadata/AutomaticMetadataCollection/).
It's a java agent you attach to a running process and that records all proxies, reflective calls,
etc. You can apply some "include filters" so that you only catch stuff under this or that package ;
otherwise the generated metadata can be quite large.

The easiest way to get the agent is to run a GraalVM JDK and add the native build tools [gradle
plugin](https://graalvm.github.io/native-build-tools/latest/gradle-plugin.html) ; then whenever you
run a task you can add `-Pagent` and the tracing agent will collect metadata and store it in
build/native/agent-outout/ or some similar location. For backwards-compatibility, I recommend your
run Graal JDK 17 for now, that's what the do in the metadata repo (Graal 23 will generate the new
reachability format). You should also be able to run the `nativeTest` task which runs your tests in
native mode.

The way I'd recommmend you do this is to write some unit tests, and run the tracing-agent against
those tests. Take the output of the tracing agent, put it in `META-INF/...` in the source
of the project, then run those tests again in native mode, and they should pass. Then you can look
at the metadata, and start removing superfluous entries (e.g. stuff that's not related to
docker-java), and see if the tests still pass.

The most important thing is that you want these tests to touch _all_ of your API. You don't
necessarily need to run all of your logic there, but you must touch all of the API so that the
tracing agent gathers data on every possible scenario. If you have some corner-cases that are harder
to touch, you can add them manually to `reflect-config.json`.

Maybe to get started, you can steal the reflect-config I produced in the reachability repo, and see
if those run the native tests? some stuff should probably fail because I'm fairly sure it's not
comprehensive - they've been generated from a single test, that cannot possibly cover all use-cases.

Note that for the `docker-java` api, since we haven't written comprehensive tests, what we've done
is manually include ALL the subtypes for `DockerObject` and TC's `AbstrDockerCmd`, which results in
a bigger image than what the users need.
