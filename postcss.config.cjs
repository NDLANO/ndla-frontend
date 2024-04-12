/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const postcssImport = require("postcss-import");
const postcssPresetEnv = require("postcss-preset-env");
const postcssReporter = require("postcss-reporter");
const panda = require("@pandacss/dev/postcss");

module.exports = {
  plugins: [
    panda(),
    postcssImport({
      glob: true,
    }),
    // This breaks panda somehow
    // postcssPresetEnv(),
    postcssReporter({
      // Posts messages from plugins to the terminal
      clearMessages: true,
    }),
  ],
};
