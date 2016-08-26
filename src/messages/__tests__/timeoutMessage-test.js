/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import test from 'ava';
import { isFSA } from 'flux-standard-action';
import { clearMessage, timeoutMessage } from '../messagesActions';

test.cb.serial('actions/timeoutMessage', (t) => {
  const message = {
    id: 123,
    message: 'All went well',
    severity: 'success',
    timeToLive: 500,
  };

  timeoutMessage(message)(actual => {
    t.truthy(isFSA(actual), 'FSA compliant action');
    t.deepEqual(actual, clearMessage(message.id));
    t.end();
  });
});
