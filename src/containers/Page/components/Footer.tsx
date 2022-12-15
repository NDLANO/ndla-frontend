/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Footer, FooterText, EditorName, LanguageSelector } from '@ndla/ui';
import {
  Facebook,
  Instagram,
  LinkedIn,
  EmailOutline,
  Youtube,
} from '@ndla/icons/common';
import { useTranslation } from 'react-i18next';

interface Props {
  ndlaFilm?: boolean;
}

const FooterWrapper = ({ ndlaFilm }: Props) => {
  const { t, i18n } = useTranslation();

  const links = [
    {
      to: 'https://www.facebook.com/ndla.no',
      text: t('footer.socialMediaLinks.facebook'),
      icon: <Facebook />,
    },
    {
      to: 'https://instagram.com/ndla_no/',
      text: t('footer.socialMediaLinks.instagram'),
      icon: <Instagram />,
    },
    {
      to: 'https://www.linkedin.com/company/ndla/',
      text: t('footer.socialMediaLinks.linkedin'),
      icon: <LinkedIn />,
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

  const privacyLinks = [
    { url: 'https://om.ndla.no/gdpr', label: t('footer.privacyLink') },
    { url: 'https://om.ndla.no/cookies', label: t('footer.cookiesLink') },
  ];

  return (
    <Footer
      lang={i18n.language}
      //@ts-ignore Wrongly typed as an array with a single element in frontend-packages.
      links={links}
      languageSelector={
        <LanguageSelector
          //not used, but not removed from props.
          options={{}}
          center
          outline
          alwaysVisible
          inverted={!!ndlaFilm}
          currentLanguage={i18n.language}
        />
      }
      privacyLinks={privacyLinks}>
      <FooterText>
        <EditorName title={t('footer.editorInChief')} name="Sigurd Trageton" />
        {t('footer.info')}
      </FooterText>
    </Footer>
  );
};

export default FooterWrapper;
