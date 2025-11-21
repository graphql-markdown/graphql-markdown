# Post-Merge Setup Checklist

This checklist helps maintainers complete the setup after merging the build chain improvements.

## 1. Configure Repository Secrets

### 1.1 Create npm Token
- [ ] Go to https://www.npmjs.com/settings/YOUR_USERNAME/tokens
- [ ] Click "Generate New Token" → Select "Automation"
- [ ] Name: `graphql-markdown-automation`
- [ ] Copy the token (you won't see it again!)
- [ ] Go to GitHub repository → Settings → Secrets and variables → Actions
- [ ] Click "New repository secret"
  - Name: `NPM_TOKEN`
  - Value: (paste the token)
- [ ] Click "Add secret"

### 1.2 Create GitHub PAT (Personal Access Token)
- [ ] Go to https://github.com/settings/tokens
- [ ] Click "Generate new token (classic)"
- [ ] Name: `graphql-markdown-bot`
- [ ] Expiration: No expiration (or set to 1 year and renew)
- [ ] Select scopes:
  - [x] `repo` (all repo permissions)
  - [x] `workflow`
- [ ] Click "Generate token"
- [ ] Copy the token (you won't see it again!)
- [ ] Go to GitHub repository → Settings → Secrets and variables → Actions
- [ ] Click "New repository secret"
  - Name: `BOT_PAT`
  - Value: (paste the token)
- [ ] Click "Add secret"

### 1.3 Verify Secrets
- [ ] Go to repository Settings → Secrets and variables → Actions
- [ ] Verify you see:
  - `BOT_PAT`
  - `NPM_TOKEN`
  - `DOCKERHUB_USERNAME` (should already exist)
  - `DOCKERHUB_TOKEN` (should already exist)

## 2. Update Branch Protection Rules

- [ ] Go to repository Settings → Branches
- [ ] Click "Edit" on `main` branch protection rule (or "Add rule" if none exists)
- [ ] Configure:
  - [x] Require a pull request before merging
    - Required approvals: 1
  - [x] Require status checks to pass before merging
    - [x] Require branches to be up to date
    - Add status checks:
      - `test` or `Test / test`
      - `lint` or `Lint / lint`
  - [x] Require conversation resolution before merging
  - [x] Do not allow bypassing the above settings (optional)
- [ ] Click "Save changes"

## 3. Test the Setup

### 3.1 Test Commit Message Validation (Local)
```bash
# Clone the repo
git clone https://github.com/graphql-markdown/graphql-markdown.git
cd graphql-markdown

# Install dependencies
bun install

# Try making a test commit
echo "test" >> README.md
git add README.md
git commit -m "test"  # This should be rejected

git commit -m "docs: test commit"  # This should work
git reset HEAD~1  # Undo the commit
git restore README.md
```

### 3.2 Test Changeset Creation
```bash
# Create a test changeset
bun changeset

# Follow the prompts:
# - Select a package (e.g., @graphql-markdown/core)
# - Select "patch"
# - Enter description: "Test changeset"

# Verify changeset was created
ls .changeset/*.md

# Clean up
git restore .changeset/
```

### 3.3 Test Release Workflow (Create Test PR)
```bash
# Create a test branch
git checkout -b test/release-workflow

# Create a real changeset
bun changeset
# Select @graphql-markdown/utils
# Select patch
# Description: "Test release workflow"

# Commit
git add .
git commit -m "test: add test changeset"

# Push
git push origin test/release-workflow

# Create a PR to main
# Merge the PR
# Watch GitHub Actions → Release workflow should run
# It should create a "Version Packages" PR
```

### 3.4 Test Preview Packages
```bash
# Create a test PR
git checkout -b test/preview-packages
echo "// test" >> packages/core/src/index.ts
git add .
git commit -m "test: preview packages"
git push origin test/preview-packages

# Create PR
# Add label "preview" to the PR
# Watch GitHub Actions → Preview Packages workflow should run
# Comment should be posted with installation URLs
```

### 3.5 Test Publishing (in staging environment recommended)
⚠️ **Warning**: This will publish real packages to npm!

Only do this when ready for a real release:
```bash
# Wait for "Version Packages" PR to be created
# Review the PR:
#   - Check version bumps are correct
#   - Check CHANGELOG.md updates
#   - Check package.json versions

# Merge the "Version Packages" PR
# Watch GitHub Actions → Release workflow should:
#   1. Publish packages to npm
#   2. Create GitHub releases
```

## 4. Monitor First Release

### 4.1 Check npm Packages
- [ ] Go to https://www.npmjs.com/package/@graphql-markdown/core
- [ ] Verify new version is published
- [ ] Check "Provenance" tab
- [ ] Verify provenance statement is present and valid

### 4.2 Check GitHub Releases
- [ ] Go to repository Releases page
- [ ] Verify releases were created
- [ ] Check release notes
- [ ] Verify tags are correct

### 4.3 Check Changelogs
- [ ] Check `packages/*/CHANGELOG.md` files
- [ ] Verify entries are formatted correctly
- [ ] Verify links to PRs work

## 5. Update Documentation (if needed)

- [ ] Review `docs/RELEASE.md` - update if needed
- [ ] Review `docs/MIGRATION.md` - update if needed
- [ ] Update README.md if needed
- [ ] Create announcement in Discussions
- [ ] Update CONTRIBUTING.md if needed

## 6. Clean Up

- [ ] Delete `.changeset/example-changeset.md` after first real release
- [ ] Delete test branches created during testing
- [ ] Close test PRs

## 7. Inform Team

- [ ] Share migration guide with contributors: `docs/MIGRATION.md`
- [ ] Announce new release process in:
  - [ ] GitHub Discussions
  - [ ] Discord/Slack (if applicable)
  - [ ] Twitter/Social media (if applicable)
- [ ] Update any internal documentation

## 8. Long-term Monitoring

### Week 1
- [ ] Monitor first few releases
- [ ] Check for any issues with workflows
- [ ] Verify stale issue workflow runs correctly
- [ ] Check preview packages work consistently

### Month 1
- [ ] Review changelog quality
- [ ] Adjust stale issue thresholds if needed
- [ ] Gather feedback from contributors
- [ ] Consider adding fast-check if needed

### Ongoing
- [ ] Monitor npm provenance statements
- [ ] Watch for bun native provenance support (issue #15601)
- [ ] Update workflows as GitHub Actions evolve
- [ ] Renew BOT_PAT before expiration

## Troubleshooting

### Release workflow fails
**Check:**
1. NPM_TOKEN is valid and has correct permissions
2. Package versions don't already exist on npm
3. Workflow logs for specific errors
4. npm registry status

### Commit messages rejected
**Check:**
1. Message follows format: `type: subject`
2. Type is one of: feat, fix, build, conf, refactor, test, ci, docs, tag, other
3. Husky hooks are installed (`bun install`)

### Preview packages not created
**Check:**
1. PR has `preview` label OR author is a maintainer
2. Packages build successfully locally
3. Workflow logs for errors

### Need help?
- Check `docs/RELEASE.md`
- Check `.github/workflows/README.md`
- Check `docs/BUILD_CHAIN_SUMMARY.md`
- Open an issue with the `question` label

## Success Criteria

- [x] All secrets configured
- [x] Branch protection updated
- [x] Test changeset created successfully
- [x] First release published successfully
- [x] npm provenance verified
- [x] GitHub releases created
- [x] Team informed
- [x] Documentation reviewed

🎉 Build chain setup is complete!
