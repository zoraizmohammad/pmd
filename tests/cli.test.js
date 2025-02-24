const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

describe('PMD CLI Tests', () => {
    const testDir = path.join(__dirname, 'test-cli');
    
    beforeAll(() => {
        fs.ensureDirSync(testDir);
    });

    afterAll(() => {
        fs.removeSync(testDir);
    });

    test('should initialize PMD repository', async () => {
        process.chdir(testDir);
        await execAsync('pmd init');
        
        expect(fs.existsSync(path.join(testDir, '.pmd'))).toBe(true);
        expect(fs.existsSync(path.join(testDir, '.pmd', 'key'))).toBe(true);
        expect(fs.existsSync(path.join(testDir, 'viewer.html'))).toBe(true);
    });

    test('should encrypt markdown file', async () => {
        const testFile = path.join(testDir, 'test.md');
        fs.writeFileSync(testFile, '# Test\nThis is a test markdown file.');
        
        await execAsync('pmd encrypt test.md user1,user2 pass1,pass2');
        
        expect(fs.existsSync(path.join(testDir, 'test.pmd'))).toBe(true);
        
        const pmdContent = fs.readFileSync(path.join(testDir, 'test.pmd'), 'utf8');
        expect(pmdContent).toMatch(/<content>.*<\/content>/);
        expect(pmdContent).toMatch(/<users>.*<\/users>/);
        expect(pmdContent).toMatch(/<passwords>.*<\/passwords>/);
    });
});
