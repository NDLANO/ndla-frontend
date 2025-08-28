/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createInstance, i18n, InitOptions, ReadCallback, Services } from "i18next";
import { initReactI18next } from "react-i18next";
import config from "./config";
import { LocaleType } from "./interfaces";

export const supportedLanguages: LocaleType[] = ["nb", "nn", "en", "se"];
export const preferredLanguages: LocaleType[] = ["nb", "nn"];
export const myndlaLanguages: LocaleType[] = ["nb", "nn", "en"];

type LocaleObject = {
  name: string;
  abbreviation: LocaleType;
};

const NB: LocaleObject = {
  name: "Bokmål",
  abbreviation: "nb",
};
const NN: LocaleObject = {
  name: "Nynorsk",
  abbreviation: "nn",
};

const EN: LocaleObject = {
  name: "English",
  abbreviation: "en",
};

const SE: LocaleObject = {
  name: "Nordsamisk",
  abbreviation: "se",
};

export const appLocales = [NB, NN, EN, SE];
export const preferredLocales = [NB, NN];

export const getLocaleObject = (localeAbbreviation?: string): LocaleObject => {
  const locale = appLocales.find((l) => l.abbreviation === localeAbbreviation);

  return locale || NB; // defaults to NB
};

export const isValidLocale = (localeAbbreviation: string | undefined | null): localeAbbreviation is LocaleType =>
  appLocales.find((l) => l.abbreviation === localeAbbreviation) !== undefined;

export const getHtmlLang = (localeAbbreviation?: string): string => {
  const locale = appLocales.find((l) => l.abbreviation === localeAbbreviation);
  return locale?.abbreviation ?? config.defaultLocale;
};

export const getLangAttributeValue = (lang: string) => {
  return lang === "nn" || lang === "nb" ? "no" : lang;
};

interface RetType extends LocaleObject {
  basepath: string;
  basename: string;
}

export const getLocaleInfoFromPath = (path: string): RetType => {
  const paths = path.split("/");
  const basename = paths[1] && isValidLocale(paths[1]) ? paths[1] : "";
  const basepath = basename ? path.replace(`/${basename}`, "") : path;
  return {
    basepath: basepath.length === 0 ? "/" : basepath,
    basename,
    ...getLocaleObject(basename),
  };
};

export const initializeI18n = (locale: string): i18n => {
  const i18nInstance = createInstance({
    lng: locale,
    supportedLngs: supportedLanguages,
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
  })
    .use(initReactI18next)
    .use(I18nBackend);
  i18nInstance.init();
  return i18nInstance as i18n;
};

class I18nBackend {
  services: Services;
  options: any;
  allOptions: InitOptions;
  static type: "backend";

  constructor(services: Services, options: object = {}, allOptions: InitOptions = {}) {
    this.services = services;
    this.options = options;
    this.allOptions = allOptions;
  }
  init() {}

  read(language: string, namespace: string, callback: ReadCallback) {
    return fetch(`/locales/${language}/${namespace}.json`)
      .then((res) => res.json())
      .then((data) => callback(null, data))
      .catch((err) => callback(err, false));
  }
}

I18nBackend.type = "backend";
