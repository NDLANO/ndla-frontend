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

export const isValidLocale = (localeAbbreviation: string | undefined | null): localeAbbreviation is LocaleType =>
  !!localeAbbreviation && supportedLanguages.includes(localeAbbreviation as LocaleType);

export const getHtmlLang = (localeAbbreviation?: string): LocaleType => {
  const locale = supportedLanguages.find((l) => l === localeAbbreviation);
  return locale ?? (config.defaultLocale as LocaleType);
};

export const getLangAttributeValue = (lang: string) => {
  return lang === "nn" || lang === "nb" ? "no" : lang;
};

export const getLocaleInfoFromPath = (path: string) => {
  const paths = path.split("/");
  const basename = paths[1] && isValidLocale(paths[1]) ? paths[1] : "";
  const basepath = basename ? path.replace(`/${basename}`, "") : path;
  return {
    basepath: basepath.length === 0 ? "/" : basepath,
    basename,
    abbreviation: getHtmlLang(basename),
  } as const;
};

export const initializeI18n = (locale: string, hash: string): i18n => {
  const i18nInstance = createInstance({
    lng: locale,
    supportedLngs: supportedLanguages,
    backend: {
      hash,
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
    this.init(services, options, allOptions);
  }
  init(services: Services, backendOptions = {}, allOptions: InitOptions = {}) {
    this.services = services;
    this.options = backendOptions;
    this.allOptions = allOptions;
  }

  read(language: string, namespace: string, callback: ReadCallback) {
    return fetch(`/locales/${language}/${namespace}-${this.options.hash}.json`)
      .then((res) => res.json())
      .then((data) => callback(null, data))
      .catch((err) => callback(err, false));
  }
}

I18nBackend.type = "backend";
