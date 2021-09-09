#!/bin/bash

set -e

cd /docusaurus2

npx docusaurus graphql-to-doc

yarn build --no-minify
