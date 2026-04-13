export default {
    testEnvironment: 'node',
    transform: {
        '^.+\\.js$': ['babel-jest', { configFile: './babel.config.cjs' }]
    },
    transformIgnorePatterns: [],
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        'controllers/**/*.js',
        'middleware/**/*.js',
        'models/**/*.js',
        'routes/**/*.js',
        '!**/node_modules/**'
    ],
    testMatch: ['**/__tests__/**/*.test.js'],
    testTimeout: 15000,
};
