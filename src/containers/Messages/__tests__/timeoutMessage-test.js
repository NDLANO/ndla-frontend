/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { isFSA } from 'flux-standard-action';
import { clearMessage, timeoutMessage } from '../messagesActions';

test('actions/timeoutMessage', done => {
  const message = {
    id: 123,
    message: 'All went well',
    severity: 'success',
    timeToLive: 500,
  };

  timeoutMessage(message)(actual => {
    expect(isFSA(actual)).toBeTruthy();
    expect(actual).toEqual(clearMessage(message.id));
    done();
  });
});
