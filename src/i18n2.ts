import { i18n } from 'i18next';
import { ApolloClient } from '@apollo/client';
//@ts-ignore
import { createApolloLinks } from './util/apiHelpers';
import nb from './messages/messagesNB';
import nn from './messages/messagesNN';
import en from './messages/messagesEN';
import { STORED_LANGUAGE_KEY } from './constants';

export const initializeI18n = (
  i18n: i18n,
  client: ApolloClient<object>,
): void => {
  i18n.options.supportedLngs = ['nb', 'nn'];
  i18n.addResourceBundle('en', 'translation', en, false, false);
  i18n.addResourceBundle('nb', 'translation', nb, false, false);
  i18n.addResourceBundle('nn', 'translation', nn, false, false);

  i18n.on('languageChanged', function(language) {
    if (typeof document != 'undefined') {
      document.documentElement.lang = language;
    }
    if (typeof window != 'undefined') {
      client.resetStore();
      client.setLink(createApolloLinks(language));
      window.localStorage.setItem(STORED_LANGUAGE_KEY, language);
    }
  });
};
