#!/usr/bin/env bash
# Installs every non-CLI/non-Docusaurus package tgz into the current project,
# mirroring the old Earthfile `INSTALL_GQLMD` UDC.
set -euo pipefail

PKG_DIR="${1:?usage: install-gqlmd.sh <package-tgz-dir>}"
: "${REPO_ROOT:?REPO_ROOT env var must be set}"

packages=()
for pkg in $(node "$REPO_ROOT/packages/tooling-config/scripts/build-packages.mjs"); do
  case "$pkg" in
    cli|docusaurus) continue ;;
  esac
  packages+=("$PKG_DIR/graphql-markdown-$pkg.tgz")
done

npm install --save "${packages[@]}"
