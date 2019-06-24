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
  EmbeddedFacebookPage,
  EmbeddedTwitter,
} from '@ndla/ui';

export const SubjectPageSocialMedia = ({ twitter }) => {
  return (
    <OneColumn noPadding>
      <SubjectChildContent>
        <SubjectSocialContent>
          {twitter && (
            <SubjectSocialSection title="Twitter">
              <EmbeddedTwitter screenName={twitter} tweetLimit={1} />
            </SubjectSocialSection>
          )}
          {
            <SubjectSocialSection title="Facebook">
              <EmbeddedFacebookPage href={'https://facebook.com/ndla.no'} />
            </SubjectSocialSection>
          }
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
