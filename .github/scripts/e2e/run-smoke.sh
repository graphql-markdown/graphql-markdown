#!/usr/bin/env bash
# Bundles the manual build -> pack -> scaffold -> smoke-test recipe documented in
# CONTRIBUTING.md into a single command. Reuses the existing scripts as-is; this is
# purely a call-sequencing wrapper, no suite logic lives here.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# setup-docusaurus-project.sh and pack-packages.mjs live one level up, in
# .github/scripts/ (unlike their e2e/ siblings here).
SHARED_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
export REPO_ROOT="${REPO_ROOT:-$PWD}"

usage() {
  cat >&2 <<'EOF'
usage: run-smoke.sh [cli|docusaurus2|docusaurus3|all] [graphql-version]

Builds and packs the workspace once, then scaffolds a throwaway project and
runs the smoke-test suite for the selected target(s). The optional second
argument selects the GraphQL major to install (16 or 17, default 16) and
applies to every suite, including `all`. With no argument, prompts
interactively. Must be run from the repository root.
EOF
}

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  usage
  exit 0
fi

SUITE="${1:-}"
if [[ -z "$SUITE" ]]; then
  PS3="Select a smoke suite to run: "
  options=("CLI" "Docusaurus 2" "Docusaurus 3" "All")
  select opt in "${options[@]}"; do
    case "$opt" in
      "CLI") SUITE=cli; break ;;
      "Docusaurus 2") SUITE=docusaurus2; break ;;
      "Docusaurus 3") SUITE=docusaurus3; break ;;
      "All") SUITE=all; break ;;
      *) echo "Invalid selection." >&2 ;;
    esac
  done
fi

GRAPHQL_VERSION="${2:-16}"

case "$SUITE" in
  cli|docusaurus2|docusaurus3|all) ;;
  *)
    echo "Unknown suite: $SUITE" >&2
    usage
    exit 1
    ;;
esac

SCRATCH_ROOT="$(mktemp -d "${TMPDIR:-/tmp}/gqlmd-smoke.XXXXXX")"
PKG_DIR="$SCRATCH_ROOT/pkgs"
trap 'echo "Scaffolded projects (not auto-removed): $SCRATCH_ROOT" >&2' EXIT

build_and_pack() {
  echo "::group::Build and pack workspace packages"
  (cd "$REPO_ROOT" && bun run build)
  node "$SHARED_DIR/pack-packages.mjs" "$PKG_DIR"
  echo "::endgroup::"
}

run_cli() {
  local graphql_version="$1"
  echo "::group::CLI smoke suite"
  local project_dir="$SCRATCH_ROOT/cli-gqlmd"
  "$SCRIPT_DIR/setup-cli-project.sh" "$graphql_version" "$project_dir" "$PKG_DIR"
  cp "$REPO_ROOT/tests/e2e/cli/__data__/graphql-doc-generator-multi-instance.config.mjs" \
    "$project_dir/graphql.config.mjs"
  PROJECT_DIR="$project_dir" "$SCRIPT_DIR/smoke-test.sh" cli "$project_dir"
  echo "::endgroup::"
}

run_docusaurus() {
  local version="$1"
  local graphql_version="$2"
  echo "::group::Docusaurus $version smoke suite"
  local project_dir="$SCRATCH_ROOT/docusaurus${version}-gqlmd"
  "$SHARED_DIR/setup-docusaurus-project.sh" "$version" "$graphql_version" "$project_dir" "$PKG_DIR"
  (cd "$project_dir" && npm install --save "$REPO_ROOT/tests/e2e/helpers/e2e-test-webpack-plugin")
  PROJECT_DIR="$project_dir" "$SCRIPT_DIR/smoke-test.sh" docusaurus "$project_dir"
  echo "::endgroup::"
}

build_and_pack

case "$SUITE" in
  cli) run_cli "$GRAPHQL_VERSION" ;;
  docusaurus2) run_docusaurus 2 "$GRAPHQL_VERSION" ;;
  docusaurus3) run_docusaurus 3 "$GRAPHQL_VERSION" ;;
  all)
    run_cli "$GRAPHQL_VERSION"
    run_docusaurus 2 "$GRAPHQL_VERSION"
    run_docusaurus 3 "$GRAPHQL_VERSION"
    ;;
esac
