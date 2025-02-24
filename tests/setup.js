const fs = require('fs-extra');
const path = require('path');

// Create necessary test directories
const testDirs = [
    path.join(__dirname, 'test-files'),
    path.join(__dirname, 'test-cli'),
    path.join(__dirname, 'test-viewer')
];

testDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.ensureDirSync(dir);
        fs.ensureDirSync(path.join(dir, '.pmd'));
    }
});
