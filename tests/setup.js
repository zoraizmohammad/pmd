const fs = require('fs-extra');
const path = require('path');

// Test directories
const TEST_DIRS = {
    fixtures: path.join(__dirname, 'fixtures'),
    unit: path.join(__dirname, 'unit'),
    integration: path.join(__dirname, 'integration'),
    temp: path.join(__dirname, 'temp')
};

// Create necessary test directories
Object.values(TEST_DIRS).forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.ensureDirSync(dir);
    }
});

// Create .pmd directory in fixtures if it doesn't exist
const pmdDir = path.join(TEST_DIRS.fixtures, '.pmd');
if (!fs.existsSync(pmdDir)) {
    fs.ensureDirSync(pmdDir);
}

// Export test constants
global.TEST_DIRS = TEST_DIRS;
global.TEST_FILES = {
    markdown: path.join(TEST_DIRS.fixtures, 'testmarkdown.md'),
    pmd: path.join(TEST_DIRS.fixtures, 'testmarkdown.pmd')
};
