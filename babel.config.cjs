module.exports = {
  plugins: [
    [
      "graphql-tag",
      {
        strip: true,
        transform: (_, ast) => {
          delete ast.loc;
          return ast;
        },
      },
    ],
  ],
};
