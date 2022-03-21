module.exports = {
  client: {
    name: 'graphql',
    service: {
      url: 'http://localhost:4000/graphql-api/graphql',
    },
    includes: ['./src/**/*.{ts,tsx,js,jsx,graphql}'],
  },
};
