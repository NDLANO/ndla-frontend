/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { MatomoTracker } from '@ndla/ui';
import config from '../../config';

export const Matomo = () => {
  if (config.matomoSiteId) {
    return (
      <MatomoTracker
        siteId={config.matomoSiteId}
        trackerUrl={config.matomoUrl}
      />
    );
  }
  return null;
};

export default Matomo;
