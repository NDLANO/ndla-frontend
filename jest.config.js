module.exports = {
  testRegex: '/__tests__/.*-test.(js|jsx)$',
  setupFiles: ['./src/__tests__/_initTestEnv.js'],
  setupTestFrameworkScriptFile: './src/__tests__/jest.setup.js',
  testURL: 'http://localhost/', // Needed until fixed: https://github.com/jsdom/jsdom/issues/2304
};
