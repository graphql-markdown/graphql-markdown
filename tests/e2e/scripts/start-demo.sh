#!/bin/bash

set -e

cd /usr/src/app/docusaurus2

npx docusaurus graphql-to-doc

yarn build --no-minify

yarn serve --host=0.0.0.0 --port=8080
