const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Site A
const siteAPath = 'content/site_a';
const siteAMenuPath = 'data/menu/site_a';

// Site B
const siteBPath = 'content/site_b';
const siteBMenuPath = 'data/menu/site_b';

// Common directories
const assetsPath = 'assets';
const layoutsPath = 'layouts';
const i18nPath = 'i18n';
const postsPath = 'content/posts';

// Build command function
function runBuildCommand(command) {
  try {
    console.log(`🚀 Command: ${command}`);
    execSync(command, { stdio: 'inherit' });
    console.log(`🔥 Success: ${command}`);
  } catch (error) {
    console.error(`❌ Error: ${error}`);
    process.exit(1);
  }
}

// Get changed files function
function getChangedFiles() {
  console.log('🔍 Get modified files in last commit…');
  try {
    const output = execSync(
      'git diff-tree --no-commit-id --name-only -r HEAD',
      { encoding: 'utf-8' }
    );
    return output
      .split('\n')
      .filter(Boolean)
      .map((file) => file.trim().replace(/^"|"$/g, ''));
  } catch (error) {
    console.error(`❌ Error: ${error}`);
    process.exit(1);
  }
}

// Verify that the public folder is restored from the cache
if (!fs.existsSync('public')) {
  console.log(`❌ Public directory dosen't exists`);
} else {
  console.log(`✅ Public directory exists .`);
}

// Check for changes in folders
function hasChangesInDirectory(files, directory) {
  const normalizedDirectory = path.normalize(directory);
  return files.some((file) => file.startsWith(normalizedDirectory));
}

const changedFiles = getChangedFiles();
console.log('✅ Modified files:', changedFiles);

// Build sites
if (
  hasChangesInDirectory(changedFiles, i18nPath) ||
  hasChangesInDirectory(changedFiles, layoutsPath) ||
  hasChangesInDirectory(changedFiles, assetsPath) ||
  hasChangesInDirectory(changedFiles, postsPath)
) {
  // Build all sites
  runBuildCommand('yarn build');
} else if (
  hasChangesInDirectory(changedFiles, siteAPath) ||
  hasChangesInDirectory(changedFiles, siteAMenuPath)
) {
  // Build site A
  runBuildCommand('yarn build-site_a');
} else if (
  hasChangesInDirectory(changedFiles, siteBPath) ||
  hasChangesInDirectory(changedFiles, siteBMenuPath)
) {
  // Build site B
  runBuildCommand('yarn build-site_b');
} else {
  console.log('❌ No changes detected in monitored folders.');
}
