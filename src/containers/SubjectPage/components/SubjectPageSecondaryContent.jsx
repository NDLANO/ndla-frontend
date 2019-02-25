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
  SubjectFlexWrapper,
  SubjectFlexChild,
  SubjectChildContent,
  SubjectNewContent,
  InfoWidget,
  SubjectSecondaryContent,
} from '@ndla/ui';
import { injectT } from '@ndla/i18n';
import { EmailOutline } from '@ndla/icons/common';
import formatDate from '../../../util/formatDate';
import { GraphQLResourceShape } from '../../../graphqlShapes';
import { toLinkProps } from '../../../routeHelpers';
import { getContentType } from '../../../util/getContentType';

const SubjectPageSecondaryContent = ({ latestContent, t, locale }) => (
  <SubjectSecondaryContent>
    <OneColumn noPadding>
      <SubjectChildContent>
        <SubjectFlexWrapper>
          {latestContent.length > 0 && (
            <SubjectFlexChild>
              <SubjectNewContent
                heading={t('subjectPage.newContent.heading')}
                content={latestContent.map(resource => ({
                  name: resource.name,
                  url: toLinkProps(resource, locale).to,
                  toLinkProps: () => toLinkProps(resource, locale),
                  contentType: getContentType(resource),
                  formattedDate: resource.meta
                    ? formatDate(resource.meta.lastUpdated, locale)
                    : '',
                }))}
              />
            </SubjectFlexChild>
          )}
          <SubjectFlexChild>
            <InfoWidget
              center
              heading={t('newsLetter.heading')}
              description={t('newsLetter.description')}
              mainLink={{
                name: t('newsLetter.mainLinkName'),
                href: 'https://om.ndla.no/nyhetsbrev/',
              }}
              iconLinks={[
                {
                  icon: <EmailOutline />,
                  name: t('newsLetter.iconLinkName'),
                },
              ]}
            />
          </SubjectFlexChild>
        </SubjectFlexWrapper>
      </SubjectChildContent>
    </OneColumn>
  </SubjectSecondaryContent>
);
SubjectPageSecondaryContent.propTypes = {
  latestContent: PropTypes.arrayOf(GraphQLResourceShape),
  locale: PropTypes.string.isRequired,
};

export default injectT(SubjectPageSecondaryContent);
