/*
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createContext } from 'react';

const IsMobileContext = createContext<boolean>(false);
export default IsMobileContext;
