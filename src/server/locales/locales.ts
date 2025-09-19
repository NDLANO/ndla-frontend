/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { i18n } from "i18next";
import en from "../../messages/messagesEN";
import nb from "../../messages/messagesNB";
import nn from "../../messages/messagesNN";
import se from "../../messages/messagesSE";
import { preferredLanguages } from "../../i18n";
import config from "../../config";
import { i18nInstanceWithTranslations } from "../../i18nInstanceWithTranslations";
import { createHash } from "crypto";

export const initializeI18n = (language: string): i18n => {
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

const backendI18nInstance = initializeI18n(config.defaultLocale);

const stringifyLanguage = (language: object) => {
  const stringified = JSON.stringify(language);
  return {
    translations: stringified,
    hash: createHash("md5").update(stringified).digest("hex"),
  };
};

export const stringifiedLanguages = {
  en: stringifyLanguage(backendI18nInstance.getResourceBundle("en", "translation")),
  nn: stringifyLanguage(backendI18nInstance.getResourceBundle("nn", "translation")),
  nb: stringifyLanguage(backendI18nInstance.getResourceBundle("nb", "translation")),
  se: stringifyLanguage(backendI18nInstance.getResourceBundle("se", "translation")),
} as const;
