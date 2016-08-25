/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import format from 'date-fns/format';

/* eslint-disable no-unused-vars*/
export default function formatDate(date, locale) {
  return format(date, 'DD.MM.YY');
}
/* eslint-enable */
