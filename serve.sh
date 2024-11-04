#!/usr/bin/env zsh

set -euo pipefail

docker run --rm -p 4000:4000 -v $PWD:/site bretfisher/jekyll-serve -- bundle exec jekyll serve --drafts -H 0.0.0.0

