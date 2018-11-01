/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from 'ndla-i18n';
import { Breadcrumb } from 'ndla-ui';
import { toBreadcrumbItems } from '../../../routeHelpers';
import {
  GraphQLSubjectPageShape,
  GraphQLSubjectShape,
} from '../../../graphqlShapes';
import { TopicShape } from '../../../shapes';
import SubjectPageSingle from './layout/SubjectPageSingle';
import SubjectPageDouble from './layout/SubjectPageDouble';
import SubjectPageStacked from './layout/SubjectPageStacked';
import { toTopicMenu } from '../../../util/topicsHelper';

const SubjectBreadCrumb = injectT(
  ({ t, subject }) =>
    subject ? (
      <Breadcrumb
        items={toBreadcrumbItems(
          t('breadcrumb.toFrontpage'),
          subject,
          undefined,
          undefined,
        )}
      />
    ) : null,
);

SubjectBreadCrumb.propTypes = {
  subject: GraphQLSubjectShape,
};

const SubjectPageContent = ({ layout, subject, ...rest }) => {
  const breadcrumb = <SubjectBreadCrumb subject={subject} />;
  const topics =
    subject && subject.topics
      ? subject.topics
          .filter(
            topic => !topic || !topic.parent || topic.parent === subject.id,
          )
          .map(topic => toTopicMenu(topic, subject.topics))
      : [];
  const filters =
    subject && subject.filters
      ? subject.filters.map(filter => ({
          ...filter,
          title: filter.name,
          value: filter.id,
        }))
      : [];

  const defaultProps = {
    topics,
    breadcrumb,
    filters,
  };

  switch (layout) {
    case 'single':
      return <SubjectPageSingle {...rest} {...defaultProps} />;
    case 'double':
      return <SubjectPageDouble {...rest} {...defaultProps} />;
    case 'stacked':
      return <SubjectPageStacked {...rest} {...defaultProps} />;
    default:
      return <SubjectPageSingle {...rest} {...defaultProps} />;
  }
};

SubjectPageContent.propTypes = {
  handleFilterClick: PropTypes.func.isRequired,
  subjectpage: GraphQLSubjectPageShape,
  subject: GraphQLSubjectShape,
  filters: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      value: PropTypes.string,
    }),
  ),
  topics: PropTypes.arrayOf(TopicShape),
  subjectId: PropTypes.string.isRequired,
  activeFilters: PropTypes.arrayOf(PropTypes.string),
  layout: PropTypes.oneOf(['single', 'double', 'stacked']),
};

export default injectT(SubjectPageContent);
