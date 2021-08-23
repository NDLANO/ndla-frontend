import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { getDefaultLocale } from './config';
import { STORED_LANGUAGE_KEY } from './constants';
import { isValidLocale } from './i18n';
import { LocaleType } from './interfaces';

interface Props {
  locale?: LocaleType;
  children: React.ReactNode;
}

export const I18nWrapper = ({ locale, children }: Props) => {
  const { i18n } = useTranslation();
  const history = useHistory();
  const [lang, setLang] = useState(locale);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      const storedLang = window.localStorage.getItem(STORED_LANGUAGE_KEY);
      if (
        !locale &&
        storedLang &&
        isValidLocale(storedLang) &&
        storedLang !== getDefaultLocale()
      ) {
        setLang(storedLang as LocaleType);
        if (!window.location.pathname.includes('/login/success')) {
          history.replace(`/${storedLang}${window.location.pathname}`);
        }
      }

      return;
    }
    changeBaseName(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const changeBaseName = () => {
    const supportedLanguages: string[] = i18n.options.supportedLngs as string[]; // hard-coded as a string array in i18n2.ts.
    const regex = new RegExp(supportedLanguages.map(l => `/${l}/`).join('|'));
    const paths = window.location.pathname.replace(regex, '').split('/');
    const { search } = window.location;
    const path = paths.slice().join('/');
    const fullPath = path.startsWith('/') ? path : `/${path}`;
    history.replace(`/${i18n.language}${fullPath}${search}`);
    setLang(i18n.language as LocaleType);
  };

  return (
    <BrowserRouter basename={lang} key={lang}>
      {children}
    </BrowserRouter>
  );
};
