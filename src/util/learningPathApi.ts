/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { IConfigMetaRestricted } from '@ndla/types-learningpath-api';
import {
  apiResourceUrl,
  fetch,
  resolveJsonOrRejectWithError,
} from './apiHelpers';

const baseUrl = apiResourceUrl('/learningpath-api/v1');

export const fetchExamLockStatus = (): Promise<IConfigMetaRestricted> =>
  fetch(`${baseUrl}/config/MY_NDLA_WRITE_RESTRICTED`).then(
    resolveJsonOrRejectWithError,
  );
