/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import polyglot from '../i18n';

export const Welcome = () =>
  <div>
    <h1>{polyglot.t('hello.world')}</h1>
  </div>;

export default Welcome;
