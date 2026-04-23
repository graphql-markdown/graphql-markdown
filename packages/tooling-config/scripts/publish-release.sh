#!/usr/bin/env bash
# Publish all updated packages for a release
# Uses bun pack + npm publish to correctly resolve workspace dependencies
#
# Usage: ./scripts/publish-release.sh [--dry-run|-n]
#
# Publishes packages in dependency order:
# 1. types (no deps)
# 2. utils, logger, graphql (depend on types)
# 3. helpers, diff, 
# 4. formatters (depend on utils, logger, graphql, helpers)
# 5. printer-legacy (depend on utils, graphql, formatters)
# 6. core (depends on graphql, logger, utils)
# 7. cli (depends on core, logger, printer-legacy)
# 8. docusaurus (depends on cli, logger, utils)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../../.." && pwd)"

DRY_RUN=false

for arg in "$@"; do
  case "$arg" in
    --dry-run|-n)
      DRY_RUN=true
      ;;
    --help|-h)
      echo "Usage: $0 [--dry-run|-n]"
      echo ""
      echo "Options:"
      echo "  --dry-run, -n  Show publish plan and validate without publishing"
      exit 0
      ;;
    *)
      echo "Error: Unknown argument '$arg'"
      echo "Usage: $0 [--dry-run|-n]"
      exit 1
      ;;
  esac
done

# Packages in dependency order
PACKAGES=(
  "types"
  "utils"
  "logger"
  "graphql"
  "helpers"
  "diff"
  "formatters"
  "printer-legacy"
  "core"
  "cli"
  "docusaurus"
)

is_published() {
  local name="$1" version="$2"
  [[ "$(npm view "$name@$version" version 2>/dev/null)" == "$version" ]]
}

echo "🚀 GraphQL-Markdown Release Publisher"
echo "======================================"
echo ""

if [[ "$DRY_RUN" == "true" ]]; then
  echo "🧪 Dry run mode enabled"
  echo ""
fi

# Check for uncommitted changes
if [[ -n "$(git -C "$ROOT_DIR" status --porcelain)" ]]; then
  echo "⚠️  Warning: You have uncommitted changes"
  if [[ "$DRY_RUN" == "true" ]]; then
    echo "Continuing because dry run does not publish"
  else
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
      exit 1
    fi
  fi
fi

# Show what will be published
echo "📋 Packages to publish:"
PLAN_PUBLISH=0
PLAN_SKIP=0
for pkg in "${PACKAGES[@]}"; do
  PKG_DIR="$ROOT_DIR/packages/$pkg"
  if [[ -d "$PKG_DIR" ]]; then
    NAME=$(jq -r '.name' "$PKG_DIR/package.json")
    VERSION=$(jq -r '.version' "$PKG_DIR/package.json")
    
    # Check if already published
    if is_published "$NAME" "$VERSION"; then
      echo "  ⏭️  $NAME@$VERSION (already published)"
      ((PLAN_SKIP++))
    else
      echo "  📦 $NAME@$VERSION"
      ((PLAN_PUBLISH++))
    fi
  fi
done

echo ""
echo "📝 Publish plan: $PLAN_PUBLISH to publish, $PLAN_SKIP already published"

if [[ "$DRY_RUN" == "true" ]]; then
  echo ""
  echo "Dry run complete. No packages were published."
  exit 0
fi

echo ""
read -p "Proceed with publishing? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Aborted."
  exit 0
fi

echo ""

# Publish each package
PUBLISHED=0
SKIPPED=0
FAILED=0

for pkg in "${PACKAGES[@]}"; do
  PKG_DIR="$ROOT_DIR/packages/$pkg"
  
  if [[ ! -d "$PKG_DIR" ]]; then
    continue
  fi
  
  NAME=$(jq -r '.name' "$PKG_DIR/package.json")
  VERSION=$(jq -r '.version' "$PKG_DIR/package.json")
  
  # Check if already published
  if is_published "$NAME" "$VERSION"; then
    echo "⏭️  Skipping $NAME@$VERSION (already published)"
    ((SKIPPED++))
    continue
  fi
  
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "📦 Publishing $NAME@$VERSION"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  
  if "$SCRIPT_DIR/publish-package.sh" "$pkg"; then
    ((PUBLISHED++))
  else
    echo "❌ Failed to publish $NAME"
    ((FAILED++))
    read -p "Continue with remaining packages? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
      break
    fi
  fi
done

echo ""
echo "======================================"
echo "📊 Summary:"
echo "  ✅ Published: $PUBLISHED"
echo "  ⏭️  Skipped:   $SKIPPED"
echo "  ❌ Failed:    $FAILED"
echo "======================================"
