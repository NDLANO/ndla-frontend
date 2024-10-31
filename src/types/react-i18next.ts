/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Callback, FlatNamespace, i18n, KeyPrefix, Namespace, TFunction } from "i18next";
import { FallbackNs, UseTranslationOptions } from "react-i18next";
import { LocaleType } from "../interfaces";

// TS somehow considers this a namespace if we import it from react-i18next.
export type $Tuple<T> = readonly [T?, ...T[]];

declare module "react-i18next" {
  interface CustomI18n extends Omit<i18n, "language" | "changeLanguage"> {
    language: LocaleType;
    changeLanguage: (lng: LocaleType, callback?: Callback) => Promise<TFunction>;
  }

  export type CustomUseTranslationResponse<Ns extends Namespace, KPrefix> = [
    t: TFunction<Ns, KPrefix>,
    i18n: CustomI18n,
    ready: boolean,
  ] & {
    t: TFunction<Ns, KPrefix>;
    i18n: CustomI18n;
    ready: boolean;
  };

  export function useTranslation<
    Ns extends FlatNamespace | $Tuple<FlatNamespace> | undefined = undefined,
    KPrefix extends KeyPrefix<FallbackNs<Ns>> = undefined,
  >(ns?: Ns, options?: UseTranslationOptions<KPrefix>): CustomUseTranslationResponse<FallbackNs<Ns>, KPrefix>;
}
