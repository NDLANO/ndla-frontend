module.exports = {
  extends: 'eslint-config-ndla',
  overrides: [
    {
      files: ['*.{js,jsx,ts,tsx}'],
      processor: '@graphql-eslint/graphql',
    },
    {
      files: ['*.graphql'],
      parser: '@graphql-eslint/eslint-plugin',
      plugins: ['@graphql-eslint'],
      rules: {
        '@graphql-eslint/known-type-names': 'error',
      },
      parserOptions: {
        schema: './src/schema.graphql',
      },
    },
  ],
  plugins: ['@graphql-eslint'],
  ignorePatterns: ['./src/schema.graphql'],
};
