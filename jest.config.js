module.exports = {
  testRegex: '/__tests__/.*-test.(js|jsx|ts|tsx)$',
  setupFiles: ['./src/__tests__/_initTestEnv.js'],
  setupFilesAfterEnv: ['./src/__tests__/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
        babeConfig: true,
      },
    ],
  },
};
