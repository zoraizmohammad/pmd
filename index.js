#!/usr/bin/env node

const crypto = require("crypto");
const fs = require("fs-extra");
const path = require("path");

const PMD_FOLDER = ".pmd";

// Encrypt function
function encrypt(data, key) {
    const cipher = crypto.createCipheriv("aes-256-cbc", key, key.slice(0, 16));
    let encrypted = cipher.update(data, "utf8", "base64");
    encrypted += cipher.final("base64");
    return encrypted;
}

// Initialize PMD repository
function initRepo() {
    if (!fs.existsSync(PMD_FOLDER)) {
        fs.mkdirSync(PMD_FOLDER);
        const key = crypto.randomBytes(32);
        fs.writeFileSync(path.join(PMD_FOLDER, "key"), key.toString("base64"));
        console.log("PMD initialized successfully!");
    } else {
        console.log("PMD is already initialized in this repository.");
    }
}

const { program } = require('commander');
const CryptoJS = require('crypto-js');
const chalk = require('chalk');
const inquirer = require('inquirer');
const { marked } = require('marked');

// Initialize PMD in the current directory
async function initializePMD() {
    try {
        // Create .pmd directory if it doesn't exist
        await fs.ensureDir('.pmd');
        
        // Generate a random encryption key
        const key = CryptoJS.lib.WordArray.random(256/8).toString();
        await fs.writeFile('.pmd/key', key);
        
        // Copy viewer.html template
        const viewerTemplate = path.join(__dirname, 'templates', 'viewer.html');
        await fs.copy(viewerTemplate, 'viewer.html');
        
        // Add .pmd to .gitignore
        const gitignore = await fs.readFile('.gitignore', 'utf8').catch(() => '');
        if (!gitignore.includes('.pmd/')) {
            await fs.appendFile('.gitignore', '\n.pmd/\n');
        }
        
        console.log(chalk.green('✓ PMD initialized successfully!'));
    } catch (error) {
        console.error(chalk.red('Error initializing PMD:'), error.message);
        process.exit(1);
    }
}

// Encrypt a markdown file
async function encryptFile(inputFile, usernames, passwords) {
    try {
        // Read the encryption key
        const key = await fs.readFile('.pmd/key', 'utf8');
        
        // Read the markdown content
        const content = await fs.readFile(inputFile, 'utf8');
        
        // Encrypt the content
        const encryptedContent = CryptoJS.AES.encrypt(content, key).toString();
        const encryptedUsers = CryptoJS.AES.encrypt(usernames.join(','), key).toString();
        const encryptedPasswords = CryptoJS.AES.encrypt(passwords.join(','), key).toString();
        
        // Create the .pmd file structure
        const pmdContent = `
            <content>${encryptedContent}</content>
            <users>${encryptedUsers}</users>
            <passwords>${encryptedPasswords}</passwords>
        `.trim();
        
        // Write the .pmd file
        const outputFile = inputFile.replace('.md', '.pmd');
        await fs.writeFile(outputFile, pmdContent);
        
        console.log(chalk.green(`✓ Created encrypted file: ${outputFile}`));
    } catch (error) {
        console.error(chalk.red('Error encrypting file:'), error.message);
        process.exit(1);
    }
}

// CLI command configuration
program
    .version('1.0.0')
    .description('PMD - Private Markdown Encryption for Public Repositories');

program
    .command('init')
    .description('Initialize PMD in the current directory')
    .action(initializePMD);

program
    .command('encrypt <file>')
    .description('Encrypt a markdown file')
    .action(async (file) => {
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'usernames',
                message: 'Enter comma-separated usernames:',
                validate: input => input.length > 0
            },
            {
                type: 'input',
                name: 'passwords',
                message: 'Enter comma-separated passwords:',
                validate: input => input.length > 0
            }
        ]);
        
        const usernames = answers.usernames.split(',').map(u => u.trim());
        const passwords = answers.passwords.split(',').map(p => p.trim());
        
        if (usernames.length !== passwords.length) {
            console.error(chalk.red('Error: Number of usernames must match number of passwords'));
            process.exit(1);
        }
        
        await encryptFile(file, usernames, passwords);
    });

program.parse(process.argv);