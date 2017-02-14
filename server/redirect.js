/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import express from 'express';

const app = express();

app.get('*', (req, res) => {
  const hostname = (req.headers.host.match(/:/g)) ? req.headers.host.slice(0, req.headers.host.indexOf(':')) : req.headers.host;
  res.redirect(301, `https://${hostname}${req.url}`);
});

module.exports = app;
