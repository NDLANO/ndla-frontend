/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import panda from "@pandacss/dev/postcss";
import postcssPresetEnv from "postcss-preset-env";

export default {
  plugins: [panda(), postcssPresetEnv()],
};
