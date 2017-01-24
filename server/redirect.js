/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import express from 'express';

const app = express();

app.use((req, res) => res.redirect(301, `https://${req.headers.host} ${req.url}`));

module.exports = app;
