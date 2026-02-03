/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { i18n } from "i18next";
import { preferredLanguages } from "../i18n";
import { i18nInstanceWithTranslations } from "../i18nInstanceWithTranslations";
import en from "../messages/messagesEN";
import nb from "../messages/messagesNB";
import nn from "../messages/messagesNN";
import se from "../messages/messagesSE";

export const initializeI18nTest = (language: string): i18n => {
  const i18nInstance = i18nInstanceWithTranslations.cloneInstance({
    lng: language,
    supportedLngs: preferredLanguages,
  });

  i18nInstance.addResourceBundle("en", "translation", en, true, true);
  i18nInstance.addResourceBundle("nb", "translation", nb, true, true);
  i18nInstance.addResourceBundle("nn", "translation", nn, true, true);
  i18nInstance.addResourceBundle("se", "translation", se, true, true);
  return i18nInstance as i18n;
};
