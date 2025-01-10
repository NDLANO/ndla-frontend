/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { LinkPlugin } from "@udecode/plate-link/react";
import { FloatingLinkMenu } from "../components/FloatingLinkMenu";

export const linkPlugin = LinkPlugin.extend({
  // render: { afterEditable: () => <FloatingLinkMenu /> },
});
