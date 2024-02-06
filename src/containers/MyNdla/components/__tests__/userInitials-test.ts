/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { getFirstLastInitials } from "../Avatar";

test("that function produces right initials", () => {
  expect(typeof getFirstLastInitials).toBe("function");

  expect(getFirstLastInitials("Nordmann")).toBe("N");
  expect(getFirstLastInitials("Ole Ås Nordmann")).toBe("ON");
  expect(getFirstLastInitials("Åse Ås Peter Åsen")).toBe("ÅÅ");
});
