/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { Footer, LanguageSelector, FooterText, EditorName } from '@ndla/ui';
import { Facebook, Twitter, EmailOutline, Youtube } from '@ndla/icons/common';
import ZendeskButton from '@ndla/zendesk';
import { injectT } from '@ndla/i18n';
import { getLocaleUrls } from '../../../util/localeHelpers';
import { LocationShape } from '../../../shapes';
import config from '../../../config';

// Remove when Footer in frontend-packages is updated.
const StyledFooter = styled(Footer)`
  z-index: 0;
`;

const FooterWrapper = ({ location, locale, t, inverted }) => {
  const languageSelector = (
    <LanguageSelector
      center
      outline
      alwaysVisible
      inverted={inverted}
      options={getLocaleUrls(locale, location)}
      currentLanguage={locale}
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
    <StyledFooter
      lang={locale}
      links={links}
      languageSelector={languageSelector}
      isFFServer={config.isFFServer}>
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
    </StyledFooter>
  );
};

FooterWrapper.propTypes = {
  locale: PropTypes.string.isRequired,
  location: LocationShape,
  inverted: PropTypes.bool,
};

export default injectT(FooterWrapper);
