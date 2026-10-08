#!/usr/bin/env bash
# Smoke-tests the Nuxt stack exactly as npm users get it: scaffolds a project
# with the packed create-graphql-markdown-docs, installs the packed workspace
# packages (nuxt-theme included) over the registry versions the template pins,
# then runs a full static generate. The layer ships source, so a file missing
# from a package's `files` only surfaces here, never inside the monorepo.
set -euo pipefail

PROJECT_DIR="${1:?usage: smoke-nuxt.sh <project-dir> <package-tgz-dir>}"
PKG_DIR="${2:?usage: smoke-nuxt.sh <project-dir> <package-tgz-dir>}"

npm exec --yes \
  --package "$PKG_DIR/graphql-markdown-create-graphql-markdown-docs.tgz" \
  -- create-graphql-markdown-docs \
  --yes --framework nuxt --example --pm npm --no-install --no-git \
  --dir "$PROJECT_DIR"

cd "$PROJECT_DIR"

# Every packed package except the Docusaurus plugin and the scaffolder itself,
# so the layer resolves its @graphql-markdown/* dependencies from this build.
tarballs=()
for tarball in "$PKG_DIR"/graphql-markdown-*.tgz; do
  case "$(basename "$tarball")" in
    graphql-markdown-docusaurus.tgz | graphql-markdown-create-graphql-markdown-docs.tgz) ;;
    *) tarballs+=("$tarball") ;;
  esac
done
npm install --save "${tarballs[@]}"

npx nuxi generate 2>&1 | tee generate.log

fail() {
  echo "::error::$1"
  exit 1
}

# graphql-markdown only warns when a formatter module fails to load, then
# falls back to its defaults, so a broken layer still "generates" pages.
if grep -q "error occurred while loading" generate.log; then
  fail "a module failed to load during generation (see generate.log above)"
fi

page_count=$(find content/api-reference -name '*.md' | wc -l)
[ "$page_count" -gt 0 ] || fail "no Markdown pages generated in content/api-reference"

# Output only the layer's own formatter produces: the `kind` frontmatter the
# navigation groups by, and per-badge modifier classes.
grep -rqs '^kind: ' content/api-reference ||
  fail "generated pages lack the layer formatter's 'kind' frontmatter"
grep -rqs 'gqlmd-mdx-badge-' content/api-reference ||
  fail "generated pages lack the layer formatter's badge classes"

[ -f .output/public/api-reference/index.html ] ||
  fail "API reference landing page was not prerendered"

echo "Nuxt smoke OK: $page_count pages generated and prerendered"
