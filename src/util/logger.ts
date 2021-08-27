/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// N.B! don't import this on the client!

import { createLogger } from 'bunyan';
import 'source-map-support/register';

const log = createLogger({ name: 'ndla-frontend' });

// Not used.
// log.logAndReturnValue = (level, msg, value) => {
//   log[level](msg, value);
//   return value;
// };

export default log;
