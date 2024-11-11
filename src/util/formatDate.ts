/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { formatDistanceStrict } from "date-fns";
import { TZDate } from "@date-fns/tz";
import { DateFNSLocales } from "../i18n";
import { LocaleType } from "../interfaces";

const timeZone = "CET";
export default function formatDate(date: string, locale: LocaleType) {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone,
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
    timeZone,
  }).format(date);
}

export function formatDistanceToNow(date: string, locale: LocaleType, nowDate?: Date): string {
  const tzDate = new TZDate(date, "CET");
  const now = nowDate ? nowDate : new Date();
  return formatDistanceStrict(tzDate, now, {
    addSuffix: true,
    locale: DateFNSLocales[locale],
    roundingMethod: "floor",
  });
}
