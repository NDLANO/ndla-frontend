/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MatomoTagManager } from "@ndla/tracker";
import config from "../../config";

export const Tagmanager = () => {
  if (config.matomoTagmanagerId) {
    return <MatomoTagManager containerId={config.matomoTagmanagerId} trackerUrl={config.matomoUrl} />;
  }
  return null;
};

export default Tagmanager;
