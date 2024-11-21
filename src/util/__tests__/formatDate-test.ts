/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import nb from "../../messages/messagesNB";
import formatDate, { formatDistanceToNowObject, getNdlaRobotDateFormat } from "../formatDate";

test("util/formatDate norwegian format", () => {
  expect(typeof formatDate).toBe("function");

  expect(formatDate("2014-12-24T10:44:06Z", "nb")).toBe("24.12.2014");
  expect(formatDate("1978-03-07T15:00:00Z", "nn")).toBe("07.03.1978");
});

test("util/formatDate default to English format", () => {
  expect(typeof formatDate).toBe("function");

  expect(formatDate("2014-12-24T10:44:06Z", "en")).toBe("12/24/2014");
  expect(formatDate("1978-03-07T15:00:00Z", "en")).toBe("03/07/1978");
});

const fakeTranslationFunction: any = (key: string) => {
  let current: any = nb;
  const parts = key.split(".");
  for (const part of parts) {
    current = current[part];
    if (typeof current === "string") return current;
  }
  return key;
};

test("util/formatDistanceToNow returns seconds", () => {
  expect(formatDistanceToNowObject(new Date(0), fakeTranslationFunction, new Date(1000 * 30))).toBe(
    "30 sekunder siden",
  );
  expect(formatDistanceToNowObject(new Date(0), fakeTranslationFunction, new Date(1000))).toBe("1 sekund siden");
});

test("util/formatDistanceToNow returns minutes", () => {
  expect(formatDistanceToNowObject(new Date(0), fakeTranslationFunction, new Date(1000 * 60 * 3))).toBe(
    "3 minutter siden",
  );
  expect(formatDistanceToNowObject(new Date(0), fakeTranslationFunction, new Date(1000 * 60))).toBe("1 minutt siden");
});

test("util/formatDistanceToNow returns hours", () => {
  expect(formatDistanceToNowObject(new Date(0), fakeTranslationFunction, new Date(1000 * 60 * 60 * 3))).toBe(
    "3 timer siden",
  );
  expect(formatDistanceToNowObject(new Date(0), fakeTranslationFunction, new Date(1000 * 60 * 60))).toBe(
    "1 time siden",
  );
});

test("util/formatDistanceToNow returns days", () => {
  expect(formatDistanceToNowObject(new Date(0), fakeTranslationFunction, new Date(1000 * 60 * 60 * 3 * 24))).toBe(
    "3 dager siden",
  );
  expect(formatDistanceToNowObject(new Date(0), fakeTranslationFunction, new Date(1000 * 60 * 60 * 24))).toBe(
    "1 dag siden",
  );
});

test("util/formatDistanceToNow returns months", () => {
  expect(formatDistanceToNowObject(new Date(0), fakeTranslationFunction, new Date(1000 * 60 * 60 * 3 * 24 * 31))).toBe(
    "3 måneder siden",
  );
  expect(formatDistanceToNowObject(new Date(0), fakeTranslationFunction, new Date(1000 * 60 * 60 * 24 * 31))).toBe(
    "1 måned siden",
  );
});

test("util/formatDistanceToNow returns years", () => {
  expect(
    formatDistanceToNowObject(new Date(0), fakeTranslationFunction, new Date(1000 * 60 * 60 * 3 * 24 * 31 * 12)),
  ).toBe("3 år siden");
  expect(formatDistanceToNowObject(new Date(0), fakeTranslationFunction, new Date(1000 * 60 * 60 * 24 * 31 * 12))).toBe(
    "1 år siden",
  );
});

test("That getNdlaRobotDate returns date in correct format", () => {
  const expectedFormat = "1970-01-01 01:00:00";
  const date = new Date(0);

  expect(getNdlaRobotDateFormat(date)).toBe(expectedFormat);
});
