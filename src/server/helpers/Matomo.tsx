/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MatomoTracker } from '@ndla/tracker';
import config from '../../config';

export const Matomo = () => {
  if (config.matomoSiteId) {
    return (
      <MatomoTracker
        siteId={config.matomoSiteId}
        trackerUrl={`${config.matomoUrl}/`}
      />
    );
  }
  return null;
};

export default Matomo;
