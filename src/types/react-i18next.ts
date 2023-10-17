import { $Tuple } from 'react-i18next/helpers';
import {
  Callback,
  FlatNamespace,
  i18n,
  KeyPrefix,
  Namespace,
  TFunction,
} from 'i18next';
import { LocaleType } from '../interfaces';

declare module 'react-i18next' {
  interface CustomI18n extends Omit<i18n, 'language' | 'changeLanguage'> {
    language: LocaleType;
    changeLanguage: (
      lng: LocaleType,
      callback?: Callback,
    ) => Promise<TFunction>;
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
  >(
    ns?: Ns,
    options?: UseTranslationOptions<KPrefix>,
  ): CustomUseTranslationResponse<FallbackNs<Ns>, KPrefix>;
}
