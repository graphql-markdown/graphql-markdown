#!/usr/bin/env bash
# Prints the files changed against a base ref, one per line.
#
# Fails open: if the base commit is unreachable (a shallow clone, a force-pushed
# base, the very first commit on a branch), print a sentinel that
# affected-packages.mjs treats as a global change, so CI runs everything rather
# than silently skipping required jobs.
set -euo pipefail

BASE_REF="${1:?usage: changed-files.sh <base-ref>}"

if ! git rev-parse --verify --quiet "$BASE_REF" >/dev/null; then
  git fetch --no-tags --depth=1 origin "${BASE_REF#origin/}" >/dev/null 2>&1 || true
fi

if MERGE_BASE="$(git merge-base "$BASE_REF" HEAD 2>/dev/null)"; then
  git diff --name-only "$MERGE_BASE" HEAD
else
  echo "Could not resolve base ref '$BASE_REF', assuming everything changed." >&2
  echo "bun.lock"
fi
