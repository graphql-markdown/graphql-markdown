#!/bin/bash -e

npx docusaurus graphql-to-doc

yarn start --host=0.0.0.0 --port=8080