#!/usr/bin/env bash
# Mirrors the old Earthfile `INSTALL_GRAPHQL` UDC.
set -euo pipefail

GRAPHQL_VERSION="${1:?usage: install-graphql.sh <graphql-version>}"

npm install --save graphql@"$GRAPHQL_VERSION" @graphql-tools/url-loader @graphql-tools/graphql-file-loader
