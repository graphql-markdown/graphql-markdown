#!/usr/bin/env bash
# Copies the shared e2e fixtures plus a package's own fixtures into the current
# project's ./data directory. Mirrors the `COPY root+assets/data ./data` +
# `COPY ./e2e/<package>/__data__ ./data` pairs from the old Earthfiles.
set -euo pipefail

PACKAGE="${1:?usage: copy-e2e-data.sh <docusaurus|cli>}"
: "${REPO_ROOT:?REPO_ROOT env var must be set}"

mkdir -p data
cp -R "$REPO_ROOT/tests/e2e/__data__/." ./data/
cp -R "$REPO_ROOT/tests/e2e/$PACKAGE/__data__/." ./data/
