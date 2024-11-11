/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { LocaleType } from "../interfaces";

export default function formatDate(date: string, locale: LocaleType) {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "CET",
  }).format(new Date(date));
}

export function formatDateTime(timestamp: string, locale: LocaleType) {
  return formateDateObject(new Date(timestamp), locale);
}

export function formateDateObject(date: Date, locale: LocaleType) {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "CET",
  }).format(date);
}
