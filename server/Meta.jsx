/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Helmet from 'react-helmet';

import config from '../src/config';

const Meta = () => (
  <Helmet
    title={config.app.head.title}
    meta={config.app.head.meta}
  />
);


ReactDOMServer.renderToString(<Meta />);
const header = Helmet.rewind();

export default header;
