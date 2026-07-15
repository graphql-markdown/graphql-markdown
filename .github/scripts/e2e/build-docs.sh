#!/usr/bin/env bash
# Builds the production Docusaurus site, mirroring the old website/Earthfile
# `build-api-docs` + `build-docs` targets.
set -euo pipefail

DOCUSAURUS_VERSION="${1:?usage: build-docs.sh <docusaurus-version>}"
WORK_DIR="${2:?usage: build-docs.sh <docusaurus-version> <work-dir>}"
: "${REPO_ROOT:?REPO_ROOT env var must be set}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PKG_DIR="$WORK_DIR/pkgs"
DOCUSAURUS_PROJECT_DIR="$WORK_DIR/docusaurus-gqlmd"

mkdir -p "$WORK_DIR"

echo "::group::Build workspace packages"
(cd "$REPO_ROOT" && bun run build)
"$SCRIPT_DIR/pack-packages.sh" "$PKG_DIR"
echo "::endgroup::"

echo "::group::Build API docs"
(cd "$REPO_ROOT" && bun run docs:api)
echo "::endgroup::"

echo "::group::Build Docusaurus example docs"
"$SCRIPT_DIR/setup-docusaurus-project.sh" "$DOCUSAURUS_VERSION" "$DOCUSAURUS_PROJECT_DIR" "$PKG_DIR"
"$SCRIPT_DIR/build-docs-examples.sh" "$DOCUSAURUS_PROJECT_DIR" "$REPO_ROOT/website/examples"
echo "::endgroup::"

echo "::group::Build website"
cd "$REPO_ROOT/website"
cp -R "$REPO_ROOT/api" ./api
npm ci
npx update-browserslist-db@latest
NODE_OPTIONS="--max-old-space-size=4096" DOCUSAURUS_IGNORE_SSG_WARNINGS=true DOCUSAURUS_DISABLE_GIT_METADATA=true npm run build
echo "::endgroup::"
