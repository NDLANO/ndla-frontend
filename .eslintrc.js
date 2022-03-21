module.exports = {
  extends: 'eslint-config-ndla',
  overrides: [
    {
      files: ['*.{js,jsx,ts,tsx}'],
      processor: '@graphql-eslint/graphql',
    },
    {
      files: ['*.graphql'],
      extends: ['plugin:@graphql-eslint/schema-recommended'],
      rules: {
        '@graphql-eslint/known-type-names': 'error',
      },
      parserOptions: {
        schema: './src/schema.graphql',
      },
    },
  ],
  plugins: ['@graphql-eslint'],
};
