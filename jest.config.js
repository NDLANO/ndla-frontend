module.exports = {
  testRegex: '/__tests__/.*-test.(js|jsx)$',
  setupFiles: ['./src/__tests__/_initTestEnv.js'],
  setupFilesAfterEnv: ['./src/__tests__/jest.setup.js'],
  testURL: 'http://localhost/', // Needed until fixed: https://github.com/jsdom/jsdom/issues/2304
  testEnvironment: 'node',
  /* snapshotSerializers: ['jest-emotion'], 
      disable this globally and instead import serializer in tests with emotion styles
  */
};
