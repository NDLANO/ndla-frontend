/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { messagesEN, messagesNB, messagesNN, messagesSE, messagesSMA } from "@ndla/ui";

export const supportedTranslationLanguages = ["nb", "nn", "en", "se", "sma"] as const;
const i18nInstance = i18n.use(initReactI18next);

i18nInstance.init({
  compatibilityJSON: "v3",
  fallbackLng: "nb",
  supportedLngs: supportedTranslationLanguages,
  resources: {
    en: {
      translation: messagesEN,
    },
    nn: {
      translation: messagesNN,
    },
    nb: {
      translation: messagesNB,
    },
    se: {
      translation: messagesSE,
    },
    sma: {
      translation: messagesSMA,
    },
  },
});

export { i18nInstance };
