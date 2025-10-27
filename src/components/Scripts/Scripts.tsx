/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Formbricks } from "./Formbricks";
import { Matomo } from "./Matomo";
import { Monsido } from "./Monsido";
import { Tagmanager } from "./Tagmanager";

export const Scripts = () => {
  return (
    <>
      <Formbricks />
      <Matomo />
      <Monsido />
      <Tagmanager />
    </>
  );
};
