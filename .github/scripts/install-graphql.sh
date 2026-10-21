#!/usr/bin/env bash
# Mirrors the old Earthfile `INSTALL_GRAPHQL` UDC.
set -euo pipefail

GRAPHQL_VERSION="${1:?usage: install-graphql.sh <graphql-version>}"

# Align graphql-config's `graphql` peer with the version under test so npm hoists
# a single copy of graphql.
npm pkg set "overrides.graphql-config.graphql=$GRAPHQL_VERSION"

npm install --save graphql@"$GRAPHQL_VERSION" @graphql-tools/url-loader @graphql-tools/graphql-file-loader
