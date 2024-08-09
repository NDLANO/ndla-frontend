/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import ResourceContextPage from "./ResourceContextPage";
import ResourceIdsPage from "./ResourceIdsPage";
import { useUrnIds } from "../../routeHelpers";

const ResourcePage = () => {
  const { contextId } = useUrnIds();
  if (contextId) {
    return <ResourceContextPage />;
  }
  return <ResourceIdsPage />;
};

export default ResourcePage;
