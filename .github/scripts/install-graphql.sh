#!/usr/bin/env bash
# Mirrors the old Earthfile `INSTALL_GRAPHQL` UDC.
set -euo pipefail

GRAPHQL_VERSION="${1:?usage: install-graphql.sh <graphql-version>}"

# graphql-config@5.1.6 (latest) still caps its `graphql` peer at ^16, so once
# graphql 17 is in the tree npm refuses to hoist it and nests it under the
# packages that depend on it directly. @graphql-markdown/core declares it only
# as an optional peer and resolves it through a dynamic import(), so a nested
# copy is invisible to core: config loading then silently falls back to the
# defaults and every graphql-config-driven suite fails. The library itself works
# on graphql 17 -- only the declared range is stale -- so relax the peer to the
# version under test and let it hoist again. Drop this once graphql-config
# ships support for 17.
npm pkg set "overrides.graphql-config.graphql=$GRAPHQL_VERSION"

npm install --save graphql@"$GRAPHQL_VERSION" @graphql-tools/url-loader @graphql-tools/graphql-file-loader
