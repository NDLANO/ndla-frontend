/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { formatDate, getNdlaRobotDateFormat } from "../formatDate";

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

test("That getNdlaRobotDate returns date in correct format", () => {
  const expectedFormat = "1970-01-01 01:00:00";
  const date = new Date(0);

  expect(getNdlaRobotDateFormat(date)).toBe(expectedFormat);
});
