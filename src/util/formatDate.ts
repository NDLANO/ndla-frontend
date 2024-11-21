/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { LocaleType } from "../interfaces";

const timeZone = "CET";
const timeUnits = [
  { unit: "year", ms: 1000 * 60 * 60 * 24 * 365 },
  { unit: "month", ms: 1000 * 60 * 60 * 24 * 30 },
  { unit: "day", ms: 1000 * 60 * 60 * 24 },
  { unit: "hour", ms: 1000 * 60 * 60 },
  { unit: "minute", ms: 1000 * 60 },
  { unit: "second", ms: 1000 },
];

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

export const getNdlaRobotDateFormat = (date: Date) => {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone,
    hour12: false,
  })
    .format(date)
    .replace(",", "");
};

export function useFormatDistance(date: string, toDate?: Date): string {
  const { t } = useTranslation();
  return formatDistanceToNow(date, t, toDate);
}

export function formatDistanceToNowObject(date1: Date, t: TFunction, nowDate?: Date): string {
  const date2 = nowDate ?? new Date();
  const differenceInMs: number = date2.getTime() - date1.getTime();
  for (const { unit, ms } of timeUnits) {
    const diff = differenceInMs / ms;
    const absDiff = Math.floor(Math.abs(diff));
    if (absDiff >= 1) {
      const translationKey = absDiff === 1 ? `date.units.${unit}` : `date.units.${unit}s`;
      const unitTranslated = t(translationKey);
      return `${absDiff} ${unitTranslated} ${t("date.ago")}`;
    }
  }

  return t("date.now");
}

export function formatDistanceToNow(date: string, t: TFunction, nowDate?: Date): string {
  const date1 = new Date(date);
  return formatDistanceToNowObject(date1, t, nowDate);
}
