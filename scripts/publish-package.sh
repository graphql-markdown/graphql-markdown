#!/usr/bin/env bash
# Publish a package using bun pack + npm publish with tarball
# This ensures workspace:^ dependencies are resolved correctly
#
# Usage: ./scripts/publish-package.sh <package-name>
# Example: ./scripts/publish-package.sh docusaurus

set -euo pipefail

PACKAGE_NAME="${1:-}"

if [[ -z "$PACKAGE_NAME" ]]; then
  echo "Usage: $0 <package-name>"
  echo "Available packages:"
  ls -1 packages/ | grep -v node_modules
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

# Publish using the tarball
echo "🚀 Publishing to npm..."
npm publish "$TARBALL_NAME" --access public

echo ""
echo "✅ Successfully published $FULL_NAME@$VERSION"
