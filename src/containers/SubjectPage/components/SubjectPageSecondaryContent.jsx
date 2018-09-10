/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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
import { toLinkProps } from '../../../routeHelpers';
import { getLocale } from '../../Locale/localeSelectors';

const SubjectPageSecondaryContent = ({
  subjectName,
  latestContentResources,
  t,
  locale,
}) => (
  <SubjectSecondaryContent>
    <OneColumn noPadding>
      <SubjectChildContent>
        <SubjectFlexWrapper>
          {latestContentResources &&
            latestContentResources.length > 0 && (
              <SubjectFlexChild>
                <SubjectNewContent
                  heading={t('subjectPage.newContent.heading')}
                  content={latestContentResources.map(content => ({
                    name: content.name,
                    url: toLinkProps(content).to,
                    toLinkProps: () => toLinkProps(content),
                    topicName: subjectName,
                    formattedDate: content.meta
                      ? formatDate(content.meta.lastUpdated, locale)
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
  latestContentResources: PropTypes.arrayOf(GraphQLResourceShape),
  subjectName: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  locale: getLocale(state),
});

export default connect(mapStateToProps)(injectT(SubjectPageSecondaryContent));
