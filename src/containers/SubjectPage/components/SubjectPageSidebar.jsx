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
import {
  Image,
  SubjectSidebarWrapper,
  SubjectLinks,
  SubjectAbout,
  SubjectShortcuts,
} from 'ndla-ui';
import { injectT } from 'ndla-i18n';
import { GraphQLSubjectPageShape } from '../../../graphqlShapes';
import { toSubjects } from '../../../routeHelpers';
import { getResources } from '../SubjectPage';
import SubjectTopical from './SubjectTopical';
import SubjectEditorChoices from './SubjectEditorChoices';

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
  const components = [
    {
      component: goTo && (
        <SubjectShortcuts
          key="subject_shortCuts"
          messages={{
            heading: t('subjectPage.subjectShortcuts.heading'),
            showMore: t('subjectPage.subjectShortcuts.showMore'),
            showLess: t('subjectPage.subjectShortcuts.showLess'),
          }}
          links={goTo.resourceTypes.map(type => ({
            text: type.name,
            url: getSearchUrl(subjectId, type),
          }))}
        />
      ),
      location: goTo ? goTo.location : undefined,
    },
    {
      type: 'mostread',
      component: mostRead && (
        <SubjectLinks
          key="subject_links"
          heading={t('subjectPage.mostRead.heading')}
          links={mostReadResources.map(resource => ({
            text: resource.name,
            url: toSubjects() + resource.path,
          }))}
        />
      ),
      location: mostRead ? mostRead.location : undefined,
    },
    {
      type: 'editorsChoices',
      component: (
        <SubjectEditorChoices
          key="subject_editorChoices"
          narrowScreen
          editorsChoices={editorsChoices}
        />
      ),
      location: editorsChoices ? editorsChoices.location : undefined,
    },
    {
      component: <SubjectTopical key="subject_topical" topical={topical} />,
      location: topical ? topical.location : undefined,
    },
    {
      component: about && (
        <SubjectAbout
          key="subject_about"
          media={
            <Image
              alt="Forstørrelsesglass"
              src="https://staging.api.ndla.no/image-api/raw/42-45210905.jpg"
            />
          }
          heading={about.title}
          description={about.description}
        />
      ),
      location: about ? about.location : undefined,
    },
  ]
    .filter(component => !!component.location)
    .sort((a, b) => a.location - b.location);

  return (
    <SubjectSidebarWrapper>
      {components.map(component => component.component)}
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
