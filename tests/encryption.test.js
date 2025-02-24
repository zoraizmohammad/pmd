const fs = require('fs-extra');
const path = require('path');
const CryptoJS = require('crypto-js');

describe('PMD Encryption Tests', () => {
    const testDir = path.join(__dirname, 'test-files');
    const testKey = CryptoJS.lib.WordArray.random(256/8).toString();
    
    beforeAll(() => {
        // Create test directory and files
        fs.ensureDirSync(testDir);
        fs.writeFileSync(path.join(testDir, '.pmd', 'key'), testKey);
    });

    afterAll(() => {
        // Clean up test files
        fs.removeSync(testDir);
    });

    test('should encrypt markdown content correctly', () => {
        const content = '# Test Markdown\nThis is a test.';
        const users = ['user1', 'user2'];
        const passwords = ['pass1', 'pass2'];

        const encryptedContent = CryptoJS.AES.encrypt(content, testKey).toString();
        const encryptedUsers = CryptoJS.AES.encrypt(users.join(','), testKey).toString();
        const encryptedPasswords = CryptoJS.AES.encrypt(passwords.join(','), testKey).toString();

        // Verify encryption
        const decryptedContent = CryptoJS.AES.decrypt(encryptedContent, testKey).toString(CryptoJS.enc.Utf8);
        const decryptedUsers = CryptoJS.AES.decrypt(encryptedUsers, testKey).toString(CryptoJS.enc.Utf8).split(',');
        const decryptedPasswords = CryptoJS.AES.decrypt(encryptedPasswords, testKey).toString(CryptoJS.enc.Utf8).split(',');

        expect(decryptedContent).toBe(content);
        expect(decryptedUsers).toEqual(users);
        expect(decryptedPasswords).toEqual(passwords);
    });

    test('should validate user credentials correctly', () => {
        const users = ['user1', 'user2'];
        const passwords = ['pass1', 'pass2'];
        
        const encryptedUsers = CryptoJS.AES.encrypt(users.join(','), testKey).toString();
        const encryptedPasswords = CryptoJS.AES.encrypt(passwords.join(','), testKey).toString();

        // Test valid credentials
        const decryptedUsers = CryptoJS.AES.decrypt(encryptedUsers, testKey).toString(CryptoJS.enc.Utf8).split(',');
        const decryptedPasswords = CryptoJS.AES.decrypt(encryptedPasswords, testKey).toString(CryptoJS.enc.Utf8).split(',');
        
        const userIndex = decryptedUsers.indexOf('user1');
        expect(userIndex).not.toBe(-1);
        expect(decryptedPasswords[userIndex]).toBe('pass1');
    });

    test('should reject invalid credentials', () => {
        const users = ['user1', 'user2'];
        const passwords = ['pass1', 'pass2'];
        
        const encryptedUsers = CryptoJS.AES.encrypt(users.join(','), testKey).toString();
        const encryptedPasswords = CryptoJS.AES.encrypt(passwords.join(','), testKey).toString();

        // Test invalid credentials
        const decryptedUsers = CryptoJS.AES.decrypt(encryptedUsers, testKey).toString(CryptoJS.enc.Utf8).split(',');
        const decryptedPasswords = CryptoJS.AES.decrypt(encryptedPasswords, testKey).toString(CryptoJS.enc.Utf8).split(',');
        
        const userIndex = decryptedUsers.indexOf('invalid_user');
        expect(userIndex).toBe(-1);
    });
});
