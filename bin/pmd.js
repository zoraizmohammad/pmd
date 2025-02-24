#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto-js');
const { program } = require('commander');

// Read version from package.json
const packageJson = require('../package.json');

program
  .version(packageJson.version)
  .description('PMD - Private Markdown encryption tool');

program
  .command('init')
  .description('Initialize PMD in the current directory')
  .action(() => {
    // Create .pmd directory if it doesn't exist
    if (!fs.existsSync('.pmd')) {
      fs.mkdirSync('.pmd');
    }

    // Generate encryption key if it doesn't exist
    if (!fs.existsSync('.pmd/key')) {
      const key = crypto.lib.WordArray.random(32).toString();
      fs.writeFileSync('.pmd/key', key);
    }

    // Copy viewer.html if it doesn't exist
    if (!fs.existsSync('viewer.html')) {
      const viewerPath = path.join(__dirname, '../web/viewer.html');
      fs.copyFileSync(viewerPath, 'viewer.html');
    }

    // Add .pmd to .gitignore if it doesn't exist
    let gitignore = '';
    if (fs.existsSync('.gitignore')) {
      gitignore = fs.readFileSync('.gitignore', 'utf8');
    }
    if (!gitignore.includes('.pmd/')) {
      fs.appendFileSync('.gitignore', '\n.pmd/\n');
    }

    console.log('✅ PMD initialized successfully!');
  });

program
  .command('encrypt <file> <users> <passwords>')
  .description('Encrypt a markdown file')
  .action((file, users, passwords) => {
    // Check if file exists
    if (!fs.existsSync(file)) {
      console.error('❌ File not found:', file);
      process.exit(1);
    }

    // Read encryption key
    if (!fs.existsSync('.pmd/key')) {
      console.error('❌ PMD not initialized. Run "pmd init" first.');
      process.exit(1);
    }
    const key = fs.readFileSync('.pmd/key', 'utf8');

    // Read markdown content
    const content = fs.readFileSync(file, 'utf8');

    // Split users and passwords
    const userList = users.split(',');
    const passList = passwords.split(',');

    if (userList.length !== passList.length) {
      console.error('❌ Number of users and passwords must match');
      process.exit(1);
    }

    // Encrypt content and credentials
    const encryptedContent = crypto.AES.encrypt(content, key).toString();
    const encryptedUsers = crypto.AES.encrypt(users, key).toString();
    const encryptedPasswords = crypto.AES.encrypt(passwords, key).toString();

    // Create PMD file structure
    const pmdContent = `<content>${encryptedContent}</content>
<users>${encryptedUsers}</users>
<passwords>${encryptedPasswords}</passwords>`;

    // Write to .pmd file
    const pmdFile = file.replace(/\.md$/, '.pmd');
    fs.writeFileSync(pmdFile, pmdContent);

    console.log('✅ File encrypted successfully:', pmdFile);
  });

program
  .command('view <file>')
  .description('View a PMD file in the terminal')
  .action((file) => {
    if (!fs.existsSync(file)) {
      console.error('❌ File not found:', file);
      process.exit(1);
    }

    console.log('🔒 Use the web viewer (viewer.html) to view encrypted PMD files');
  });

program.parse(process.argv);
