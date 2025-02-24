module.exports = {
    testEnvironment: 'jsdom',
    moduleFileExtensions: ['js', 'json'],
    transform: {},
    testMatch: [
        '**/tests/**/*.test.js'
    ],
    setupFiles: ['./tests/setup.js'],
    verbose: true,
    testTimeout: 10000
};
