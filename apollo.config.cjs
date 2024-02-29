module.exports = {
  client: {
    service: {
      name: 'graphql',
      localSchemaFile: './src/schema.graphql',
      includes: ['./src/**/*.{ts,tsx,js,jsx}'],
    },

    excludes: ['**/__tests__/**', './src/schema.graphql'],
  },
};
