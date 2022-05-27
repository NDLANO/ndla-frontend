/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Footer, LanguageSelector, FooterText, EditorName } from '@ndla/ui';
import { Facebook, Twitter, EmailOutline, Youtube } from '@ndla/icons/common';
import { useTranslation } from 'react-i18next';
import { getLocaleUrls } from '../../../util/localeHelpers';
import { useIsNdlaFilm } from '../../../routeHelpers';

const FooterWrapper = () => {
  const { t, i18n } = useTranslation();
  const ndlaFilm = useIsNdlaFilm();

  const languageSelector = (
    <LanguageSelector
      center
      outline
      alwaysVisible
      inverted={ndlaFilm}
      options={getLocaleUrls(i18n.language, window.location)}
      currentLanguage={i18n.language}
    />
  );

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
      languageSelector={languageSelector}>
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

export default FooterWrapper;
