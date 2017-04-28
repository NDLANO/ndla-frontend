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
  const hostname = req.get('Host');
  if (hostname === undefined || !hostname.match(/^(.+\.)?ndla\.no$/gi)) {
    res.send(400);
  }

  res.redirect(301, `https://${hostname}${req.url}`);
});
module.exports = app;
