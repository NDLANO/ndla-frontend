module.exports = {
  testRegex: '/__tests__/.*-test.(js|jsx|ts|tsx)$',
  setupFiles: ['./src/__tests__/_initTestEnv.js'],
  setupFilesAfterEnv: ['./src/__tests__/jest.setup.js'],
  testURL: 'http://localhost/', // Needed until fixed: https://github.com/jsdom/jsdom/issues/2304
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
    // Use ts-jest for typescript tests: https://kulshekhar.github.io/ts-jest/user/babel7-or-ts#no-type-checking
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  /* snapshotSerializers: ['jest-emotion'], 
      disable this globally and instead import serializer in tests with emotion styles
  */
};
