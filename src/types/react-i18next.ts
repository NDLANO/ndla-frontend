import { Callback, i18n } from 'i18next';
import { ComponentProps, ComponentType } from 'react';
import { LocaleType } from '../interfaces';

declare module 'react-i18next' {
  interface CustomI18n extends Omit<i18n, 'language' | 'changeLanguage'> {
    language: LocaleType;
    changeLanguage: (
      lng: LocaleType,
      callback?: Callback,
    ) => Promise<TFunction>;
  }

  interface CustomUseTranslationResponse<
    N extends Namespace = DefaultNamespace
  > extends Omit<UseTranslationResponse<N>, 'i18n'> {
    i18n: CustomI18n;
  }
  interface CustomWithTranslation<N extends Namespace = DefaultNamespace> {
    t: TFunction<N>;
    i18n: CustomI18n;
    tReady: boolean;
  }

  function useTranslation<N extends Namespace = DefaultNamespace>(
    ns?: N | Readonly<N>,
    options?: UseTranslationOptions,
  ): CustomUseTranslationResponse<N>;

  function withTranslation<
    N extends Namespace = DefaultNamespace,
    TKPrefix extends KeyPrefix<N> = undefined
  >(
    ns?: N,
    options?: {
      withRef?: boolean;
      keyPrefix?: TKPrefix;
    },
  ): <
    C extends ComponentType<ComponentProps<any> & WithTranslationProps>,
    ResolvedProps = JSX.LibraryManagedAttributes<
      C,
      Subtract<ComponentProps<C>, WithTranslationProps>
    >
  >(
    component: C,
  ) => ComponentType<
    Omit<ResolvedProps, keyof CustomWithTranslation<N>> & WithTranslationProps
  >;
}
