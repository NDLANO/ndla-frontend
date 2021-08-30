/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Footer, LanguageSelector, FooterText, EditorName } from '@ndla/ui';
import { Facebook, Twitter, EmailOutline, Youtube } from '@ndla/icons/common';
import ZendeskButton from '@ndla/zendesk';
import { useTranslation } from 'react-i18next';
import { StyledButton } from '@ndla/button';
import { getLocaleUrls } from '../../../util/localeHelpers';
import { LocationShape } from '../../../shapes';
import config from '../../../config';
import { AuthContext } from '../../../components/AuthenticationContext';

const FooterWrapper = ({ location, locale, inverted }) => {
  const { t, i18n } = useTranslation();
  const { authenticated } = useContext(AuthContext);

  const languageSelector = (
    <LanguageSelector
      center
      outline
      alwaysVisible
      inverted={inverted}
      options={getLocaleUrls(locale, location)}
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

  const Button = StyledButton.withComponent('a');

  return (
    <Footer lang={locale} links={links} languageSelector={languageSelector}>
      <FooterText>
        <EditorName
          title={t('footer.footerEditiorInChief')}
          name="Sigurd Trageton"
        />
        {t('footer.footerInfo')}
        <ZendeskButton locale={locale} widgetKey={config.zendeskWidgetKey}>
          {t('askNDLA')}
        </ZendeskButton>
      </FooterText>
      {config.feideEnabled && (
        <>
          {authenticated ? (
            <Button
              href="/logout"
              onClick={() =>
                localStorage.setItem('lastPath', location.pathname)
              }>
              LOGOUT
            </Button>
          ) : (
            <Button
              href="/login"
              onClick={() =>
                localStorage.setItem('lastPath', location.pathname)
              }>
              LOGIN
            </Button>
          )}
        </>
      )}
    </Footer>
  );
};

FooterWrapper.propTypes = {
  locale: PropTypes.string.isRequired,
  location: LocationShape,
  inverted: PropTypes.bool,
};

export default FooterWrapper;
