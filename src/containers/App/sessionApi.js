/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import fetch from 'isomorphic-fetch';
import { resolveJsonOrRejectWithError } from '../../util/apiHelpers';

export const fetchAccessToken = () =>
  fetch('/get_token').then(resolveJsonOrRejectWithError);
