/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import SearchContainer from '../containers/SearchPage/SearchContainer';
import NotFoundPage from '../containers/NotFoundPage/NotFoundPage';


export const routes = [
  {
    path: '',
    component: SearchContainer,
    background: true,
  },
  {
    component: NotFoundPage,
    background: false,
  },
];
