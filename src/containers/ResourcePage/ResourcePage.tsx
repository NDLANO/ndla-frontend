/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useLocation } from "react-router-dom";
import { ContextResourcePage } from "./ContextResourcePage";
import { ResourceIdsPage } from "./ResourceIdsPage";

const ResourcePage = () => {
  const location = useLocation();
  if (location.pathname.startsWith("/ressurs")) {
    return <ContextResourcePage />;
  }
  return <ResourceIdsPage />;
};

export default ResourcePage;
