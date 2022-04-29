import { useApolloClient } from '@apollo/client';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { useVersionHash } from './components/VersionHashContext';
import { getDefaultLocale } from './config';
import { STORED_LANGUAGE_KEY } from './constants';
import { appLocales, isValidLocale } from './i18n';
import { InitialProps, LocaleType } from './interfaces';
import { createApolloLinks } from './util/apiHelpers';

interface Props {
  locale?: LocaleType;
  initialProps: InitialProps;
}

export const I18nWrapper = ({ locale, initialProps }: Props) => {
  const { i18n } = useTranslation();
  const history = useHistory();
  const [lang, setLang] = useState(locale);
  const firstRender = useRef(true);
  const apolloClient = useApolloClient();
  const versionHash = useVersionHash();

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
          history.replace(
            `/${storedLang}${window.location.pathname}${window.location.search}`,
          );
          apolloClient.setLink(
            createApolloLinks(storedLang, document.cookie, versionHash),
          );
          apolloClient.resetStore();
        }
      } else if (locale && !isValidLocale(locale)) {
        const l =
          window.localStorage.getItem(STORED_LANGUAGE_KEY) ??
          getDefaultLocale();
        history.replace(`${l}/404`);
      }

      return;
    }
    changeBaseName(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const changeBaseName = () => {
    const regex = new RegExp(
      appLocales
        .map(a => a.abbreviation)
        .map(l => `/${l}/`)
        .join('|'),
    );
    const paths = window.location.pathname.replace(regex, '').split('/');
    const { search } = window.location;
    const path = paths.slice().join('/');
    const fullPath = path.startsWith('/') ? path : `/${path}`;
    history.replace(`/${i18n.language}${fullPath}${search}`);
    setLang(i18n.language as LocaleType);
  };

  return (
    <BrowserRouter basename={lang} key={lang}>
      <App
        initialProps={initialProps}
        isClient={true}
        client={apolloClient}
        locale={lang}
        key={lang}
        versionHash={versionHash}
      />
    </BrowserRouter>
  );
};
