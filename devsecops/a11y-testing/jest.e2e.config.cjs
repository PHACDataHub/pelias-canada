module.exports = {
  displayName: 'e2e',
  testMatch: ['<rootDir>/e2e-tests/*test.e2e.js'],
  transform: {
    '.*\\.js$': 'babel-jest',
  },
  testTimeout: 60000, // Increase timeout for e2e test
};
