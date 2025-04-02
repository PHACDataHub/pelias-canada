module.exports = {
  displayName: 'unit',
  testMatch: ['<rootDir>/src/*.test.unit.js'],
  transform: {
    '.*\\.js$': 'babel-jest',
  },
};
