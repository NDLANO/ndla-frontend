import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'src/schema.graphql',
  documents: './src/**/!(*.d).{ts,tsx}',
  generates: {
    'src/graphqlTypes.ts': {
      plugins: ['typescript', 'typescript-operations'],
    },
  },
  config: {
    maybeValue: 'T',
    typesPrefix: 'GQL',
    inlineFragmentTypes: 'combine',
  },
};
export default config;
