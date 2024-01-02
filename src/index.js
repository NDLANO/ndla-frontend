/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/*  eslint-disable no-console, global-require */

import config from "./config";

let app = require("./server/server").default;

if (module.hot) {
  module.hot.accept("./server/server", function () {
    console.log("🔁  HMR Reloading `./server/server`...");
    try {
      app = require("./server/server").default;
    } catch (error) {
      console.error(error);
    }
  });
  console.info("✅  Server-side HMR Enabled!");
}

if (!config.isVercel) {
  app.listen(config.port, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`> Started on port ${config.port}`);
  });
}

export default app;
