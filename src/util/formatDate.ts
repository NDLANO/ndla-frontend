/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import format from 'date-fns/format';
import { LocaleType } from '../interfaces';

export default function formatDate(date: string, locale: LocaleType) {
  if (locale === 'nb' || locale === 'nn') {
    return format(new Date(date), 'dd.MM.yyyy');
  }
  return format(new Date(date), 'MM/dd/yyyy');
}
