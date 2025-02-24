const fs = require('fs-extra');
const path = require('path');
const CryptoJS = require('crypto-js');

// Function to encrypt a markdown file
function encryptMarkdown(markdownPath, users, passwords) {
    // Generate encryption key
    const key = CryptoJS.lib.WordArray.random(256/8).toString();
    
    // Read markdown content
    const content = fs.readFileSync(markdownPath, 'utf8');
    
    // Encrypt the content and credentials
    const encryptedContent = CryptoJS.AES.encrypt(content, key).toString();
    const encryptedUsers = CryptoJS.AES.encrypt(users.join(','), key).toString();
    const encryptedPasswords = CryptoJS.AES.encrypt(passwords.join(','), key).toString();
    
    // Create PMD format
    const pmdContent = `
<!-- PMD Encrypted File -->
<!-- Do not modify this file manually -->
<content>${encryptedContent}</content>
<users>${encryptedUsers}</users>
<passwords>${encryptedPasswords}</passwords>
`.trim();
    
    // Save as .pmd file
    const pmdPath = markdownPath.replace('.md', '.pmd');
    fs.writeFileSync(pmdPath, pmdContent);
    
    // Save key in .pmd directory
    const pmdDir = path.join(path.dirname(markdownPath), '.pmd');
    fs.ensureDirSync(pmdDir);
    fs.writeFileSync(path.join(pmdDir, 'key'), key);
    
    return { pmdPath, key };
}

// Function to attempt decryption
function decryptPMD(pmdPath, username, password) {
    try {
        // Read PMD content
        const pmdContent = fs.readFileSync(pmdPath, 'utf8');
        
        // Read encryption key
        const pmdDir = path.join(path.dirname(pmdPath), '.pmd');
        const key = fs.readFileSync(path.join(pmdDir, 'key'), 'utf8');
        
        // Extract encrypted parts
        const contentMatch = pmdContent.match(/<content>(.*?)<\/content>/s);
        const usersMatch = pmdContent.match(/<users>(.*?)<\/users>/s);
        const passwordsMatch = pmdContent.match(/<passwords>(.*?)<\/passwords>/s);
        
        if (!contentMatch || !usersMatch || !passwordsMatch) {
            throw new Error('Invalid PMD file format');
        }
        
        // Decrypt users and passwords
        const users = CryptoJS.AES.decrypt(usersMatch[1], key).toString(CryptoJS.enc.Utf8).split(',');
        const passwords = CryptoJS.AES.decrypt(passwordsMatch[1], key).toString(CryptoJS.enc.Utf8).split(',');
        
        // Verify credentials
        const userIndex = users.indexOf(username);
        if (userIndex === -1 || passwords[userIndex] !== password) {
            throw new Error('Invalid credentials');
        }
        
        // Decrypt content
        const decryptedContent = CryptoJS.AES.decrypt(contentMatch[1], key).toString(CryptoJS.enc.Utf8);
        return decryptedContent;
        
    } catch (error) {
        return null; // Return null if decryption fails
    }
}

// Demo the encryption and decryption
async function runDemo() {
    console.log('PMD Encryption/Decryption Demo\n');
    
    // Test file paths
    const markdownPath = path.join(__dirname, '..', 'testmarkdown.md');
    
    // Encrypt the file
    console.log('1. Encrypting markdown file...');
    const { pmdPath, key } = encryptMarkdown(
        markdownPath,
        ['admin', 'user1'],
        ['admin123', 'pass123']
    );
    console.log(`   ✓ Created ${path.basename(pmdPath)}`);
    console.log(`   ✓ Encryption key: ${key}\n`);
    
    // Try viewing with correct credentials
    console.log('2. Attempting to view with correct credentials...');
    const validContent = decryptPMD(pmdPath, 'admin', 'admin123');
    if (validContent) {
        console.log('   ✓ Successfully decrypted content:');
        console.log('   ' + '-'.repeat(50));
        console.log(validContent.split('\n').map(line => '   ' + line).join('\n'));
        console.log('   ' + '-'.repeat(50) + '\n');
    }
    
    // Try viewing with incorrect credentials
    console.log('3. Attempting to view with incorrect credentials...');
    const invalidContent = decryptPMD(pmdPath, 'hacker', 'wrong123');
    if (!invalidContent) {
        console.log('   ✓ Access denied - showing raw encrypted content:');
        console.log('   ' + '-'.repeat(50));
        console.log(fs.readFileSync(pmdPath, 'utf8').split('\n').map(line => '   ' + line).join('\n'));
        console.log('   ' + '-'.repeat(50));
    }
}

// Run the demo
runDemo().catch(console.error);
