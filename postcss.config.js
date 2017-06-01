/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const cssnext = require('postcss-cssnext');
const postcssFocus = require('postcss-focus');
const postcssImport = require('postcss-import');
const postcssReporter = require('postcss-reporter');

module.exports = {
  plugins: [
    postcssImport({
      glob: true,
    }),
    postcssFocus(), // Add a :focus to every :hover
    cssnext({
      // Allow future CSS features to be used, also auto-prefixes the CSS...
      browsers: ['last 2 versions', 'IE >= 10'], // ...based on this browser list
    }),
    postcssReporter({
      // Posts messages from plugins to the terminal
      clearMessages: true,
    }),
  ],
};
