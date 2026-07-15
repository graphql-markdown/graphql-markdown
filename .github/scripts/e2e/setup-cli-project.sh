#!/usr/bin/env bash
# Scaffolds a throwaway CLI project and installs the locally-built
# graphql-markdown packages into it, mirroring the old Earthfile
# `setup-cli-project` target.
set -euo pipefail

PROJECT_DIR="${1:?usage: setup-cli-project.sh <project-dir> <package-tgz-dir>}"
PKG_DIR="${2:?usage: setup-cli-project.sh <project-dir> <package-tgz-dir>}"
: "${REPO_ROOT:?REPO_ROOT env var must be set}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

mkdir -p "$PROJECT_DIR"
cd "$PROJECT_DIR"

"$SCRIPT_DIR/install-gqlmd.sh" "$PKG_DIR"
"$SCRIPT_DIR/install-graphql.sh"
npm install --save "$PKG_DIR/graphql-markdown-cli.tgz"
