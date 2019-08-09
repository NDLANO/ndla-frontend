/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Footer, LanguageSelector, FooterText, EditorName } from '@ndla/ui';
import ZendeskButton from '@ndla/zendesk';
import { injectT } from '@ndla/i18n';
import { getLocaleUrls } from '../../../util/localeHelpers';
import { LocationShape } from '../../../shapes';
import config from '../../../config';

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

  return (
    <Footer
      lang={locale}
      links={{
        facebook: 'https://www.facebook.com/ndla.no',
        twitter: 'https://twitter.com/ndla_no',
        email: 'https://om.ndla.no/nyhetsbrev/',
      }}
      languageSelector={languageSelector}>
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
    </Footer>
  );
};

FooterWrapper.propTypes = {
  locale: PropTypes.string.isRequired,
  location: LocationShape.isRequired,
  inverted: PropTypes.bool,
};

export default injectT(FooterWrapper);
