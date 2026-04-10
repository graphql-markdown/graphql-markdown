#!/usr/bin/env bash
# Publish a package using bun pack + npm publish with tarball
# This ensures workspace:^ dependencies are resolved correctly
#
# Usage: ./scripts/publish-package.sh [--dry-run|-n] <package-name>
# Example: ./scripts/publish-package.sh docusaurus
# Example: ./scripts/publish-package.sh --dry-run docusaurus

set -euo pipefail

usage() {
  echo "Usage: $0 [--dry-run|-n] <package-name>"
  echo ""
  echo "Options:"
  echo "  --dry-run, -n  Prepare and validate publish artifacts without publishing"
  echo ""
  echo "Available packages:"
  ls -1 packages/ | grep -v node_modules
}

PACKAGE_NAME=""
DRY_RUN=false

for arg in "$@"; do
  case "$arg" in
    --dry-run|-n)
      DRY_RUN=true
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    -*)
      echo "Error: Unknown option '$arg'"
      usage
      exit 1
      ;;
    *)
      if [[ -z "$PACKAGE_NAME" ]]; then
        PACKAGE_NAME="$arg"
      else
        echo "Error: Too many arguments"
        usage
        exit 1
      fi
      ;;
  esac
done

if [[ -z "$PACKAGE_NAME" ]]; then
  usage
  exit 1
fi

PACKAGE_DIR="packages/$PACKAGE_NAME"

if [[ ! -d "$PACKAGE_DIR" ]]; then
  echo "Error: Package directory '$PACKAGE_DIR' not found"
  exit 1
fi

cd "$PACKAGE_DIR"

# Get package info
FULL_NAME=$(jq -r '.name' package.json)
VERSION=$(jq -r '.version' package.json)

# Create tarball name (npm format: scope-name-version.tgz)
TARBALL_NAME=$(echo "$FULL_NAME" | sed 's/@//g' | sed 's/\//-/g')-${VERSION}.tgz

echo "📦 Publishing $FULL_NAME@$VERSION"
echo ""

# Remove old tarballs
rm -f *.tgz

# Pack with bun (resolves workspace:^ to actual versions)
echo "🔧 Packing with bun..."
bun pm pack

# Verify tarball exists
if [[ ! -f "$TARBALL_NAME" ]]; then
  echo "Error: Expected tarball '$TARBALL_NAME' not found"
  echo "Found tarballs:"
  ls -la *.tgz 2>/dev/null || echo "  (none)"
  exit 1
fi

# Show resolved dependencies
echo ""
echo "📋 Resolved dependencies:"
tar -xzf "$TARBALL_NAME" -O package/package.json | jq '.dependencies // {}' 2>/dev/null || true

# Verify no workspace: references
if tar -xzf "$TARBALL_NAME" -O package/package.json | grep -q '"workspace:'; then
  echo ""
  echo "❌ Error: Tarball still contains workspace: references!"
  echo "This should not happen. Check bun version."
  exit 1
fi

echo ""
echo "✅ Dependencies resolved correctly"
echo ""

if [[ "$DRY_RUN" == "true" ]]; then
  echo "🧪 Dry run enabled"
  echo "Would run: npm publish $TARBALL_NAME --access public --workspaces=false"
  echo ""
  echo "🔍 Running npm publish --dry-run validation..."
  npm publish "$TARBALL_NAME" --access public --workspaces=false --dry-run
  echo ""
  echo "✅ Dry run completed for $FULL_NAME@$VERSION"
  exit 0
fi

# Publish using the tarball
echo "🚀 Publishing to npm..."
npm publish "$TARBALL_NAME" --access public --workspaces=false

echo ""
echo "✅ Successfully published $FULL_NAME@$VERSION"
