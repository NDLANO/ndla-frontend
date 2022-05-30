/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useLocation } from 'react-router-dom';
import { Footer, FooterText, EditorName, LanguageSelector } from '@ndla/ui';
import { Facebook, Twitter, EmailOutline, Youtube } from '@ndla/icons/common';
import { useTranslation } from 'react-i18next';
import { useIsNdlaFilm } from '../../../routeHelpers';
import { getLocaleUrls } from '../../../util/localeHelpers';

const FooterWrapper = () => {
  const { t, i18n } = useTranslation();

  const links = [
    {
      to: 'https://www.facebook.com/ndla.no',
      text: t('footer.socialMediaLinks.facebook'),
      icon: <Facebook />,
    },
    {
      to: 'https://twitter.com/ndla_no',
      text: t('footer.socialMediaLinks.twitter'),
      icon: <Twitter />,
    },
    {
      to: 'https://www.youtube.com/channel/UCBlt6T8B0mmvDh3k5q7EhsA',
      text: t('footer.socialMediaLinks.youtube'),
      icon: <Youtube />,
    },
    {
      to: 'https://om.ndla.no/nyhetsbrev/',
      text: t('footer.socialMediaLinks.newsletter'),
      icon: <EmailOutline />,
    },
  ];

  return (
    <Footer
      lang={i18n.language}
      //@ts-ignore Wrongly typed as an array with a single element in frontend-packages.
      links={links}
      languageSelector={
        typeof window !== 'undefined' && <ClientLanguageSelector />
      }>
      <FooterText>
        <EditorName
          title={t('footer.footerEditiorInChief')}
          name="Sigurd Trageton"
        />
        {t('footer.footerInfo')}
      </FooterText>
    </Footer>
  );
};

const ClientLanguageSelector = () => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const ndlaFilm = useIsNdlaFilm();
  return (
    <LanguageSelector
      center
      outline
      alwaysVisible
      inverted={!!ndlaFilm}
      options={getLocaleUrls(i18n.language, location)}
      currentLanguage={i18n.language}
    />
  );
};

export default FooterWrapper;
