/**
 * Copyright (c) 2026-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

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
