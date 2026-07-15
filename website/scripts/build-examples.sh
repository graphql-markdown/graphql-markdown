#!/usr/bin/env bash
# Generates the two example doc sets embedded in the website, mirroring the
# old website/Earthfile `build-docusaurus-examples` + `BUILD_EXAMPLES` UDC.
set -euo pipefail

PROJECT_DIR="${1:?usage: build-examples.sh <docusaurus-project-dir> <out-examples-dir>}"
OUT_DIR="${2:?usage: build-examples.sh <docusaurus-project-dir> <out-examples-dir>}"
: "${REPO_ROOT:?REPO_ROOT env var must be set}"

# graphql-to-doc runner lives with the shared CI primitives.
GQLMD="$REPO_ROOT/.github/scripts/gqlmd.sh"

cd "$PROJECT_DIR"
npm install --save prettier
cp -R "$REPO_ROOT/tests/e2e/__data__/." ./data/
cp -R "$REPO_ROOT/tests/e2e/docusaurus/__data__/." ./data/

mkdir -p examples

"$GQLMD" --options "--homepage data/anilist.md --schema https://graphql.anilist.co/ --base . --link /examples/default --force --pretty --deprecated group"
mv docs ./examples/default
if [[ -z "$(find ./examples/default -type f \( -name '*.md' -o -name '*.mdx' \) -print -quit)" ]]; then
  echo "No markdown files generated for the 'default' example" >&2
  exit 1
fi

"$GQLMD" --id schema_with_grouping --options "--homepage data/groups.md --schema data/schema_with_grouping.graphql --groupByDirective @doc(category|=Common) --base . --link /examples/group-by --skip @noDoc --index --noParentType --deprecated group --hierarchy entity"
mv docs ./examples/group-by
if [[ -z "$(find ./examples/group-by -type f \( -name '*.md' -o -name '*.mdx' \) -print -quit)" ]]; then
  echo "No markdown files generated for the 'group-by' example" >&2
  exit 1
fi

mkdir -p "$OUT_DIR"
cp -R ./examples/. "$OUT_DIR/"
