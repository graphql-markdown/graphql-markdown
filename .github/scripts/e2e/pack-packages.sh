#!/usr/bin/env bash
# Packs every publishable workspace package into a .tgz, mirroring the old
# Earthfile `build-package` target (bun pm pack from within each package dir).
set -euo pipefail

OUT_DIR="${1:?usage: pack-packages.sh <out-dir>}"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"

mkdir -p "$OUT_DIR"

for pkg in $(node "$REPO_ROOT/packages/tooling-config/scripts/build-packages.mjs"); do
  (cd "$REPO_ROOT/packages/$pkg" && bun pm pack --quiet --filename "$OUT_DIR/graphql-markdown-$pkg.tgz")
done
