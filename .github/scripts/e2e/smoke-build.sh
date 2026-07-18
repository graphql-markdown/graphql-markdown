#!/usr/bin/env bash
# Runs a production smoke build against a scaffolded project: wires in the e2e
# fixtures, generates docs via graphql-to-doc, then builds and clears the site.
# Mirrors the old tests/Earthfile `smoke-docusaurus-run` target. OPTIONS (which
# may be empty) is read from the environment.
set -euo pipefail

PACKAGE="${1:?usage: smoke-build.sh <docusaurus|cli> <project-dir>}"
PROJECT_DIR="${2:?usage: smoke-build.sh <docusaurus|cli> <project-dir>}"
: "${REPO_ROOT:?REPO_ROOT env var must be set}"

cd "$PROJECT_DIR"

"$REPO_ROOT/.github/scripts/e2e/copy-e2e-data.sh" "$PACKAGE"
"$REPO_ROOT/.github/scripts/gqlmd.sh" --options "${OPTIONS:-}"
bun run build
bun run clear
