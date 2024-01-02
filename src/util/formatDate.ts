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

const timeFormatOptions = {
  nn: 'dd.MM.yyyy HH:mm:ss',
  nb: 'dd.MM.yyyy HH:mm:ss',
  en: 'dd/MM/yyyy HH:mm:ss',
  se: 'dd/MM/yyyy HH:mm:ss',
};

export function formatDateTime(timestamp: string, locale: LocaleType) {
  return format(new Date(timestamp), timeFormatOptions[locale] ?? 'dd/MM/yyyy HH:mm:ss');
}
