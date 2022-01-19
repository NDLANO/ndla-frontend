const { specifiedRules: allGraphqlRules } = require('graphql');

// issue: https://github.com/apollographql/eslint-plugin-graphql/issues/19
// After updating graphql to 15, eslint is complaining about string literals in src/queries.js file.
// We are bypassing the problem by excluding some eslint rules for graphql string literals.
const validators = allGraphqlRules
  .map(rule => rule.name)
  .filter(ruleName => [
    'NoUnusedFragments',
    'KnownFragmentNames',
    'NoUnusedVariables'
  ].includes(ruleName));

module.exports = {
  "extends": "eslint-config-ndla",
  "rules": {
    "graphql/template-strings": [ "error", {
        "env": "literal",
        "schemaJson": require("./src/gqlSchema.json"),
        validators
      }, {
        "env": "apollo",
        "schemaJson": require("./src/gqlSchema.json"),
      }],
    "react/prop-types": [2, { "ignore": ["children", "className", "t"] }]
  },
  "plugins": ["graphql"]
}
