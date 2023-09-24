---
layout:     post
title:      "Debugging Kubernetes containers"
date:       2023-09-24
categories: [blog]
author:     Daniel Garnier-Moiroux
lang:       en
excerpt:    "Debugging Kubernetes containers is mostly solved by kubectl debug.
            But there may be corner-cases where more Linux-fu is required."
---

The other day I was debugging a running `Pod` in a Kubernetes cluster, and I needed to look at the
file layout. I run images built with [buildpacks](https://buildpacks.io/), and what actually goes
into the image by default is outside my direct control, changes at runtime[^1], and is hard to find out
just by looking at the buildpack code.

One can run a shell in the container, with a simple `kubectl exec` but that only works... if there
is a shell in the running container. My container is built with the
[paketo tiny stack](https://github.com/paketo-buildpacks/jammy-tiny-stack), so, no shell for me.

There's a nifty `kubectl debug` [capability](https://kubernetes.io/docs/tasks/debug/debug-application/debug-running-pod/),
which creates an ephemeral container in your running pod. but it has limitations: for example,
you're not in the same process space as the running container, and you don't have access to volume
mounts.


## Getting volume mounts

Just start another pod with the same volumes and volume mounts 😉

You can also start an [ephemeral container](https://kubernetes.io/docs/concepts/workloads/pods/ephemeral-containers/)
with the same volume mounts, using the API server. This allows you to avoid restarting the pod or
having to create a new:

```bash
# Target the right pod
NAMESPACE="<namespace in which the pod is running>"
POD="<pod name>"

# Start kubectl proxy to be able to talk to the API server
kubectl proxy --port=8001 &

# Prepare the patch body to update the running container
PATCH_DATA='
{
    "spec":
    {
        "ephemeralContainers":
        [
            {
                "name": "debugger",
                "command": ["sh"],
                "image": "alpine:latest",
                "stdin": true,
                "tty": true,
                "volumeMounts": [
                {
                    "mountPath": "/some/mount/path",
                    "name": "the-volume",
                    "readOnly": true
                }]
            }
        ]
    }
}'


# Create an ephemeral container
curl "http://localhost:8001/api/v1/namespaces/${NAMESPACE}/pods/${POD}/ephemeralcontainers \
  -X PATCH \
  -H 'Content-Type: application/strateic-merge-patch+json' \
  -d "$PATCH_DATA"

# Run a shell in which you'll have access to "/some/mount/path"
kubectl exec -it -n ${NAMESPACE} ${POD} -c debugger -- /bin/sh
```

## Inspecting the filesystem at runtime

But the above still gives you a _new_ pod, which doesn't have access to the root filesystem of the
main container. You can access the process namespace of a running continer with `kubectl debug
--target=<container>`, see [kubernetes docs](https://kubernetes.io/docs/tasks/debug/debug-application/debug-running-pod/#ephemeral-container-example).

This doesn't work in all cases, as per the docs:

> The `--target` parameter targets the process namespace of another container.
> It's necessary here because kubectl run does not enable process namespace sharing in the pod it
> creates.
>
> **Note:** The `--target` parameter must be supported by the Container Runtime. When not supported,
> the Ephemeral Container may not be started, or it may be started with an isolated process 
> namespace so that ps does not reveal processes in other containers.


You can find the filesystem of the running container under `/proc/1/root`. You may get a "permission
denied" error, in case the container doesn't run with user 0 (root) and group root. This
[StackOverflow Answer](https://stackoverflow.com/questions/73355970/how-to-get-access-to-filesystem-with-kubectl-debug-ephemeral-containers)
shows how to create a user, add it to a group running the command, and read the root FS.

Provided you have root permissions, you may be able to impersonate the user running the command,
e.g.

```bash
# Find the user running the command in the main container
ps -o user,group,comm,args

# output example:
# USER     GROUP    COMMAND          COMMAND
# 1001     2001     dex              dex serve /config/dex-config.yml
# root     root     sh               sh
# root     root     ps               ps -o user,group,comm,args
#
# Here the userid is 1001, groupid = 2001

# Add a group with ID 2001:
addgroup -g 2001 debug-group

# Add a user with ID 1001, in group 2001, passwordless
addgroup -D -u 1001 -G 2001 debug-group debug-user

# su into it, and watch the original filesystem:
su debug-user
ls /proc/1/root/
```

Hope this helps :)

[^1]: for example, the [paketo ca-certificates](https://github.com/paketo-buildpacks/ca-certificates)
      buildpack will look at certificates mounted at a certain location, and copy them to /etc/ssl,
      at container boot time.

      If you also have the [paketo libjvm](https://github.com/paketo-buildpacks/libjvm) buildpack,
      then those certificates are added to the system JVM truststore. This depends on build-time AND
      run-time conditions. Pretty hard to figure out what is where unless you look at the actual
      running image.

