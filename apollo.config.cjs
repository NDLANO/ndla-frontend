/**
 * Copyright (c) 2026-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

module.exports = {
  client: {
    service: {
      name: "graphql",
      localSchemaFile: "./src/schema.graphql",
      includes: ["./src/**/*.{ts,tsx,js,jsx}"],
    },

    excludes: ["**/__tests__/**", "./src/schema.graphql"],
  },
};
