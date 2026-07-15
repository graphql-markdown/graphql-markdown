#!/usr/bin/env bash
# Wires e2e fixtures/specs into a scaffolded project and runs its jest smoke
# suite, mirroring the old Earthfile `SMOKE_TEST` UDC.
set -euo pipefail

PACKAGE="${1:?usage: smoke-test.sh <docusaurus|cli> <project-dir>}"
PROJECT_DIR="${2:?usage: smoke-test.sh <docusaurus|cli> <project-dir>}"
: "${REPO_ROOT:?REPO_ROOT env var must be set}"

cd "$PROJECT_DIR"

mkdir -p data __tests__/helpers __tests__/e2e
cp -R "$REPO_ROOT/tests/e2e/__data__/." ./data/
cp "$REPO_ROOT/tests/e2e/__data__/.graphqlrc" ./.graphqlrc
cp "$REPO_ROOT/tests/e2e/helpers/cli.mjs" ./__tests__/helpers/cli.mjs
cp -R "$REPO_ROOT/tests/e2e/$PACKAGE/__data__/." ./data/
rm -rf ./__tests__/e2e/specs
cp -R "$REPO_ROOT/tests/e2e/$PACKAGE/specs" ./__tests__/e2e/specs
cp "$REPO_ROOT/tests/e2e/$PACKAGE/jest.config.mjs" ./jest.config.mjs

NODE_OPTIONS="${NODE_OPTIONS:-} --experimental-vm-modules" npx --yes jest --runInBand --config ./jest.config.mjs
