/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import Matomo from "./Matomo";
import Monsido from "./Monsido";
import Tagmanager from "./Tagmanager";

const Scripts = () => {
  return (
    <>
      <Matomo />
      <Tagmanager />
      <Monsido />
    </>
  );
};

export default Scripts;
