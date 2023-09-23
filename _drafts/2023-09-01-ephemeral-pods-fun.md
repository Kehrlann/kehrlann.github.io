---
layout:     post
title:      "Kubectl debug, access the running process"
date:       2023-09-23
categories: [blog]
author:     Daniel Garnier-Moiroux
lang:       en
excerpt:    "TODO"
---

The other day I was debugging a running `Pod` in a Kubernetes cluster, and I need to look at the
file layout. I run images build with [buildpacks](https://buildpacks.io/), and what actually goes
into the image by default is outside my direct control, changes at runtime[^1], and is hard to find out
just by looking at the buildpack code.

One can run a shell in the container, with a simple `kubectl exec` but that only works... if there
is a shell in the running container. My container is built with the
[paketo tiny stack](https://github.com/paketo-buildpacks/jammy-tiny-stack), so, no shell for me.

There's a nifty `kubectl debug` [capability](https://kubernetes.io/docs/tasks/debug/debug-application/debug-running-pod/),
but it has limitations: for example, you're not in the same process space as the running container,
and you don't have access to volume mounts.


## Getting volume mounts

Just start another pod with the same volumes and volume mounts 😉

You can also start an [ephemeral container](https://kubernetes.io/docs/concepts/workloads/pods/ephemeral-containers/)
with the same volume mounts, using the API server:

```bash
# Target the right pod
NAMESPACE="<namespace in which the pod is running>"
POD="<pod name>"
CONTAINER="<name of the container you are trying to debug>"

# Start kubectl proxy to be able to talk to the API server
kubectl proxy --port=8001 &

# Prepare the patch body to update the running container
PATCH_DATA=$(jq ".spec.ephemeralContainers[0].targetContainerName |= \"$CONTAINER\"" <<< '
{
    "spec":
    {
        "ephemeralContainers":
        [
            {
                "name": "debugger",
                "command": ["sh"],
                "image": "alpine:latest",
                "targetContainerName": "<placeholder",
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
}')


# Create an ephemeral container
curl "http://localhost:8001/api/v1/namespaces/${NAMESPACE}/pods/${POD}/ephemeralcontainers \
  -X PATCH \
  -H 'Content-Type: application/strateic-merge-patch+json' \
  -d "$PATCH_DATA"

# Run a shell in which you'll have access to "/some/mount/path"
kubectl exec -it -n ${NAMESPACE} ${POD} -c ${CONTAINER} -- /bin/sh
```

## Inspecting the 



https://stackoverflow.com/questions/73355970/how-to-get-access-to-filesystem-with-kubectl-debug-ephemeral-containers

kubectl attach -n samples $(k get pods -n samples | grep client | cut -d ' ' -f 1) -c debugger -ti


[^1]: for example, the [paketo ca-certificates](https://github.com/paketo-buildpacks/ca-certificates)
      buildpack will look at certificates mounted at a certain location, and copy them to /etc/ssl.
      If you also have the [paketo libjvm](https://github.com/paketo-buildpacks/libjvm), then those
      certificats are added to the system JVM truststore. This depends on build-time AND run-time
      conditions. Pretty hard to figure out what is where unless you look at the actual running
      image.

