/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { validateTranslationFiles } from "@ndla/util";
import en from "../messagesEN";
import nb from "../messagesNB";
import nn from "../messagesNN";

test("That all translations has all language keys", () => {
  const anyMissing = validateTranslationFiles(
    [
      {
        languageName: "Norsk bokmål",
        translationObject: nb,
      },
      {
        languageName: "Norsk nynorsk",
        translationObject: nn,
      },
      {
        languageName: "English",
        translationObject: en,
      },
    ],
    "only-on-error",
  );

  expect(anyMissing).toBe(false);
});
