#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');

try {
  // Create .pmd directory if it doesn't exist
  const pmdDir = path.join(process.cwd(), '.pmd');
  if (!fs.existsSync(pmdDir)) {
    fs.mkdirSync(pmdDir);
  }

  // Copy viewer.html to the project root
  const viewerSrc = path.join(__dirname, '../web/viewer.html');
  const viewerDest = path.join(process.cwd(), 'viewer.html');
  if (!fs.existsSync(viewerDest)) {
    fs.copyFileSync(viewerSrc, viewerDest);
  }

  // Update .gitignore
  const gitignorePath = path.join(process.cwd(), '.gitignore');
  if (fs.existsSync(gitignorePath)) {
    const gitignore = fs.readFileSync(gitignorePath, 'utf8');
    if (!gitignore.includes('.pmd/')) {
      fs.appendFileSync(gitignorePath, '\n.pmd/\n');
    }
  } else {
    fs.writeFileSync(gitignorePath, '.pmd/\n');
  }

  console.log('✅ PMD installed successfully!');
} catch (error) {
  console.error('Error during PMD installation:', error);
  process.exit(1);
}
