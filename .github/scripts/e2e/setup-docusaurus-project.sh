#!/usr/bin/env bash
# Scaffolds a throwaway Docusaurus project and installs the locally-built
# graphql-markdown packages into it, mirroring the old Earthfile
# `build-docusaurus-project` + `setup-docusaurus-project` targets.
set -euo pipefail

DOCUSAURUS_VERSION="${1:?usage: setup-docusaurus-project.sh <docusaurus-version> <project-dir> <package-tgz-dir>}"
PROJECT_DIR="${2:?usage: setup-docusaurus-project.sh <docusaurus-version> <project-dir> <package-tgz-dir>}"
PKG_DIR="${3:?usage: setup-docusaurus-project.sh <docusaurus-version> <project-dir> <package-tgz-dir>}"
: "${REPO_ROOT:?REPO_ROOT env var must be set}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PARENT_DIR="$(dirname "$PROJECT_DIR")"
PROJECT_NAME="$(basename "$PROJECT_DIR")"

# create-docusaurus refuses to scaffold into a directory that already exists
# (even empty), so PROJECT_DIR must not exist yet; PARENT_DIR is a writable
# scratch dir (see E2E_ROOT_DIR in the caller).
mkdir -p "$PARENT_DIR"
cd "$PARENT_DIR"
if [[ "$DOCUSAURUS_VERSION" == "2" ]]; then
  bunx --quiet create-docusaurus@"$DOCUSAURUS_VERSION" "$PROJECT_NAME" classic --skip-install
else
  bunx --quiet create-docusaurus@"$DOCUSAURUS_VERSION" "$PROJECT_NAME" classic --skip-install --javascript
fi

cd "$PROJECT_DIR"
rm -rf docs blog src static/img

npm install
npm update @docusaurus/core @docusaurus/preset-classic
# Pin webpack to <5.95.0: webpackbar (used by Docusaurus) passes { name, color, reporters, reporter }
# to ProgressPlugin which webpack 5.95+ rejects as unknown properties (strict schema validation).
npm install --save-exact webpack@5.94.0

mkdir -p static src
cp -R "$REPO_ROOT/website/static/img" ./static/img
cp -R "$REPO_ROOT/website/src/css" ./src/css

"$SCRIPT_DIR/install-gqlmd.sh" "$PKG_DIR"
"$SCRIPT_DIR/install-graphql.sh"
npm install --save "$PKG_DIR/graphql-markdown-cli.tgz" "$PKG_DIR/graphql-markdown-docusaurus.tgz"

cp "$REPO_ROOT/tests/e2e/docusaurus/__data__/scripts/config-plugin.mjs" ./config-plugin.mjs
node config-plugin.mjs
