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
} from 'ndla-ui';
import { injectT } from 'ndla-i18n';
import { EmailOutline } from 'ndla-icons/common';
import formatDate from '../../../util/formatDate';
import { GraphQLResourceShape } from '../../../graphqlShapes';
import { toSubjects } from '../../../routeHelpers';

const SubjectPageSecondaryContent = ({
  subjectName,
  latestContentResources,
  t,
}) => (
  <SubjectSecondaryContent>
    <OneColumn noPadding>
      <SubjectChildContent>
        <SubjectFlexWrapper>
          <SubjectFlexChild>
            <SubjectNewContent
              heading={t('subjectPage.newContent.heading')}
              content={latestContentResources.map(content => ({
                name: content.name,
                url: toSubjects() + content.path,
                topicName: subjectName,
                formattedDate: content.meta
                  ? formatDate(content.meta.lastUpdated)
                  : '',
              }))}
            />
          </SubjectFlexChild>
          <SubjectFlexChild>
            <InfoWidget
              center
              heading={t('newsLetter.heading')}
              description={t('newsLetter.description')}
              mainLink={{
                name: t('newsLetter.mainLinkName'),
                href: 'http://om.ndla.no/nyhetsbrev/',
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
  latestContentResources: PropTypes.arrayOf(GraphQLResourceShape),
  subjectName: PropTypes.string.isRequired,
};

export default injectT(SubjectPageSecondaryContent);
