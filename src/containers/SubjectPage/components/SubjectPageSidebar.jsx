/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { SubjectSidebarWrapper, SubjectLinks, SubjectShortcuts } from 'ndla-ui';
import { injectT } from 'ndla-i18n';
import { GraphQLSubjectPageShape } from '../../../graphqlShapes';
import { toSubjects } from '../../../routeHelpers';
import { getResources } from '../SubjectPage';
import SubjectTopical from './SubjectTopical';
import SubjectEditorChoices from './SubjectEditorChoices';
import SubjectPageAbout from './SubjectPageAbout';

const getSearchUrl = (subjectId, resourceType) => {
  const baseUrl = '/search';
  const searchParams = {
    'resource-types': 'urn:resourcetype:subjectMaterial',
    contextFilters:
      resourceType.id !== 'urn:resourcetype:subjectMaterial'
        ? resourceType.id
        : undefined,
    page: 1,
    subjects: subjectId,
  };
  return `${baseUrl}?${queryString.stringify(searchParams)}`;
};

export const SubjectPageSidebar = ({ subjectId, subjectpage, t }) => {
  const { editorsChoices, mostRead, topical, about, goTo } = subjectpage;

  const mostReadResources = getResources(mostRead);

  return (
    <SubjectSidebarWrapper>
      {goTo && (
        <SubjectShortcuts
          messages={{
            heading: t('subjectPage.subjectShortcuts.heading'),
            showMore: t('subjectPage.subjectShortcuts.showMore'),
            showLess: t('subjectPage.subjectShortcuts.showLess'),
          }}
          links={
            goTo.resourceTypes &&
            goTo.resourceTypes.map(type => ({
              text: type.name,
              url: getSearchUrl(subjectId, type),
            }))
          }
        />
      )}
      <SubjectLinks
        heading={t('subjectPage.mostRead.heading')}
        links={mostReadResources.map(resource => ({
          text: resource.name,
          url: toSubjects() + resource.path,
        }))}
      />
      <SubjectEditorChoices narrowScreen editorsChoices={editorsChoices} />
      <SubjectTopical topical={topical} />
      <SubjectPageAbout about={about} />
    </SubjectSidebarWrapper>
  );
};
SubjectPageSidebar.propTypes = {
  subjectpage: GraphQLSubjectPageShape,
  subjectId: PropTypes.string.isRequired,
};

SubjectPageSidebar.defaultProps = {
  subjectpage: {},
};

export default injectT(SubjectPageSidebar);
