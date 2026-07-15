#!/usr/bin/env bash
# Mirrors the old Earthfile `INSTALL_GRAPHQL` UDC.
set -euo pipefail

npm install --save graphql @graphql-tools/url-loader @graphql-tools/graphql-file-loader
