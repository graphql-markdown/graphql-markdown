#!/usr/bin/env bash
# Scaffolds a throwaway CLI project and installs the locally-built
# graphql-markdown packages into it, mirroring the old Earthfile
# `setup-cli-project` target.
set -euo pipefail

PROJECT_DIR="${1:?usage: setup-cli-project.sh <project-dir> <package-tgz-dir>}"
PKG_DIR="${2:?usage: setup-cli-project.sh <project-dir> <package-tgz-dir>}"
: "${REPO_ROOT:?REPO_ROOT env var must be set}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PARENT_DIR="$(dirname "$PROJECT_DIR")"

# PROJECT_DIR may need to live at a root-owned path (e.g. /cli-gqlmd, matching
# the __ROOT_DIR__ the e2e jest config hardcodes), so fall back to sudo when
# the parent directory isn't writable by the current user.
if [[ -w "$PARENT_DIR" ]]; then
  mkdir -p "$PROJECT_DIR"
else
  sudo mkdir -p "$PROJECT_DIR"
  sudo chown -R "$(id -u):$(id -g)" "$PROJECT_DIR"
fi
cd "$PROJECT_DIR"

"$SCRIPT_DIR/install-gqlmd.sh" "$PKG_DIR"
"$SCRIPT_DIR/install-graphql.sh"
npm install --save "$PKG_DIR/graphql-markdown-cli.tgz"
