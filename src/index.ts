/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/*  eslint-disable no-console */

import config from "./config";
import app from "./server/server";

if (!config.isVercel) {
  app.listen(config.port, () => {
    console.log(`> Started on port ${config.port}`);
  });
}

export default app;
