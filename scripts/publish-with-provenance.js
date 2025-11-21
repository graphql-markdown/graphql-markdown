#!/usr/bin/env node

/**
 * Custom publish script for bun + npm provenance
 * 
 * Workaround for https://github.com/oven-sh/bun/issues/15601
 * Until bun natively supports npm provenance, we:
 * 1. Use `bun pm pack` to create tarballs
 * 2. Use `bunx npm publish <tarball> --provenance` to publish with provenance
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function exec(command, options = {}) {
  console.log(`Running: ${command}`);
  try {
    return execSync(command, {
      stdio: 'inherit',
      encoding: 'utf-8',
      ...options,
    });
  } catch (error) {
    console.error(`Command failed: ${command}`);
    throw error;
  }
}

function getPackagesToPublish() {
  // Get all package.json files in packages directory
  const packagesDir = path.join(process.cwd(), 'packages');
  const packages = [];
  
  for (const dir of fs.readdirSync(packagesDir)) {
    const packagePath = path.join(packagesDir, dir);
    const packageJsonPath = path.join(packagePath, 'package.json');
    
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      
      // Check if package is public and has a version
      if (packageJson.publishConfig?.access === 'public' && packageJson.version) {
        packages.push({
          name: packageJson.name,
          version: packageJson.version,
          path: packagePath,
          directory: packageJson.publishConfig?.directory || '.',
        });
      }
    }
  }
  
  return packages;
}

async function publishWithProvenance() {
  const packages = getPackagesToPublish();
  
  if (packages.length === 0) {
    console.log('No packages to publish');
    return;
  }
  
  console.log(`Found ${packages.length} packages to publish`);
  
  for (const pkg of packages) {
    console.log(`\n📦 Publishing ${pkg.name}@${pkg.version}`);
    
    try {
      // Navigate to package directory
      const publishPath = path.join(pkg.path, pkg.directory);
      process.chdir(publishPath);
      
      // Step 1: Create tarball with bun
      console.log('  Creating tarball...');
      exec('bun pm pack', { cwd: publishPath });
      
      // Find the created tarball
      const files = fs.readdirSync(publishPath);
      const tarball = files.find(f => f.endsWith('.tgz'));
      
      if (!tarball) {
        throw new Error('Tarball not found after packing');
      }
      
      console.log(`  Created ${tarball}`);
      
      // Step 2: Publish with npm CLI for provenance support
      console.log('  Publishing with provenance...');
      exec(`bunx npm publish ${tarball} --provenance --access public`, { 
        cwd: publishPath,
        env: {
          ...process.env,
          NPM_CONFIG_PROVENANCE: 'true',
        }
      });
      
      // Step 3: Clean up tarball
      fs.unlinkSync(path.join(publishPath, tarball));
      console.log(`  ✅ Successfully published ${pkg.name}@${pkg.version}`);
      
    } catch (error) {
      console.error(`  ❌ Failed to publish ${pkg.name}@${pkg.version}`);
      console.error(error.message);
      process.exit(1);
    }
  }
  
  console.log('\n✨ All packages published successfully!');
}

// Run the publish process
publishWithProvenance().catch(error => {
  console.error('Publish failed:', error);
  process.exit(1);
});
