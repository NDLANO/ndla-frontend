/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Footer, LanguageSelector, FooterText, FooterEditor } from '@ndla/ui';
import { getLocaleUrls } from '../../../util/localeHelpers';
import { LocationShape } from '../../../shapes';

const FooterWrapper = ({ location, locale }) => {
  const languageSelector = (
    <LanguageSelector
      center
      outline
      alwaysVisible
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
        <FooterEditor title="Ansvarlig redaktør:" name="Sigurd Trageton" />
      </FooterText>
      <FooterText>
        Nettstedet er utarbeidet av NDLA med åpen kildekode.
      </FooterText>
    </Footer>
  );
};

FooterWrapper.propTypes = {
  locale: PropTypes.string.isRequired,
  location: LocationShape.isRequired,
};

export default FooterWrapper;
