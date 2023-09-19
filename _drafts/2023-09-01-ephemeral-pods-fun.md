---
layout:     post
title:      "I love teaching"
date:       2022-10-13
categories: [teaching, conference, public speaking]
author:     Daniel Garnier-Moiroux
lang:       en
excerpt:    "I love teaching, in all its forms: mentoring
            at work, teaching at uni, giving confrence talks."
---

```
set -euo pipefail
pod_name=$(kubectl get pods -n samples | grep client | cut -d ' ' -f 1)
curl http://localhost:8001/api/v1/namespaces/samples/pods/$pod_name/ephemeralcontainers \
  -X PATCH \
  -H 'Content-Type: application/strategic-merge-patch+json' \
  -d '
{
    "spec":
    {
        "ephemeralContainers":
        [
            {
                "name": "debugger",
                "command": ["sh"],
                "image": "alpine:latest",
                "targetContainerName": "client",
                "stdin": true,
                "tty": true,
                "volumeMounts": [{
                    "mountPath": "/bindings/appsso-custom-ca-binding",
                    "name": "appsso-custom-ca-binding",
                    "readOnly": true
                },
                {
                    "mountPath": "/bindings/letsencrypt-staging-ca-binding",
                    "name": "letsencrypt-staging-ca-binding",
                    "readOnly": true
                }]
            }
        ]
    }
}'
```

https://stackoverflow.com/questions/73355970/how-to-get-access-to-filesystem-with-kubectl-debug-ephemeral-containers

kubectl attach -n samples $(k get pods -n samples | grep client | cut -d ' ' -f 1) -c debugger -ti

