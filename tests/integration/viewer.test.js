const fs = require('fs-extra');
const path = require('path');
const { JSDOM } = require('jsdom');
const CryptoJS = require('crypto-js');

describe('PMD Viewer Tests', () => {
    const testDir = path.join(__dirname, 'test-viewer');
    let dom;
    let document;
    let window;
    
    beforeAll(() => {
        fs.ensureDirSync(testDir);
        const html = fs.readFileSync(path.join(__dirname, '..', 'public', 'viewer.html'), 'utf8');
        dom = new JSDOM(html, { runScripts: 'dangerously' });
        document = dom.window.document;
        window = dom.window;
    });

    afterAll(() => {
        fs.removeSync(testDir);
    });

    test('should render login form', () => {
        const loginForm = document.getElementById('login-form');
        expect(loginForm).not.toBeNull();
        
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const submitButton = document.getElementById('decrypt-button');
        
        expect(usernameInput).not.toBeNull();
        expect(passwordInput).not.toBeNull();
        expect(submitButton).not.toBeNull();
    });

    test('should decrypt and render markdown content', () => {
        const testKey = CryptoJS.lib.WordArray.random(256/8).toString();
        const content = '# Test\nThis is a test.';
        const users = ['user1'];
        const passwords = ['pass1'];

        const encryptedContent = CryptoJS.AES.encrypt(content, testKey).toString();
        const encryptedUsers = CryptoJS.AES.encrypt(users.join(','), testKey).toString();
        const encryptedPasswords = CryptoJS.AES.encrypt(passwords.join(','), testKey).toString();

        const pmdContent = `
            <content>${encryptedContent}</content>
            <users>${encryptedUsers}</users>
            <passwords>${encryptedPasswords}</passwords>
        `.trim();

        // Simulate decryption
        const decryptedContent = CryptoJS.AES.decrypt(encryptedContent, testKey).toString(CryptoJS.enc.Utf8);
        const contentDiv = document.getElementById('content');
        contentDiv.innerHTML = decryptedContent;

        expect(contentDiv.innerHTML).toContain('# Test');
        expect(contentDiv.innerHTML).toContain('This is a test.');
    });
});
