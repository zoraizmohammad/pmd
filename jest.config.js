module.exports = {
    testEnvironment: 'jsdom',
    moduleFileExtensions: ['js', 'json'],
    transform: {},
    testMatch: [
        '**/tests/unit/**/*.test.js',
        '**/tests/integration/**/*.test.js'
    ],
    setupFiles: ['./tests/setup.js'],
    verbose: true,
    testTimeout: 10000,
    moduleNameMapper: {
        '^@fixtures/(.*)$': '<rootDir>/tests/fixtures/$1'
    }
};
