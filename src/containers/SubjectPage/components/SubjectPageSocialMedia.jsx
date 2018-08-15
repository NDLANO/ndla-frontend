/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import {
  OneColumn,
  SubjectChildContent,
  SubjectSocialSection,
  SubjectSocialContent,
  EmbeddedFacebook,
  EmbeddedTwitter,
} from 'ndla-ui';

export const SubjectPageSocialMedia = ({ twitter, facebook }) => {
  if (!twitter && !facebook) {
    return null;
  }
  return (
    <OneColumn noPadding>
      <SubjectChildContent>
        <SubjectSocialContent>
          {twitter && (
            <SubjectSocialSection title="Twitter">
              <EmbeddedTwitter screenName={twitter} tweetLimit={1} />
            </SubjectSocialSection>
          )}
          {facebook && (
            <SubjectSocialSection title="Facebook">
              <EmbeddedFacebook href={`https://www.facebook.com/${facebook}`} />
            </SubjectSocialSection>
          )}
        </SubjectSocialContent>
      </SubjectChildContent>
    </OneColumn>
  );
};
SubjectPageSocialMedia.propTypes = {
  twitter: PropTypes.string,
  facebook: PropTypes.string,
};
export default SubjectPageSocialMedia;
