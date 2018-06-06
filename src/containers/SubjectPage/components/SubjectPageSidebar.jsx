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
import {
  GraphQLSubjectPageShape,
  GraphqlResourceTypeWithsubtypesShape,
} from '../../../graphqlShapes';
import { toSubjects } from '../../../routeHelpers';
import { getResources } from '../SubjectPage';
import SubjectTopical from './SubjectTopical';
import SubjectEditorChoices from './SubjectEditorChoices';

const getSearchUrl = (subjectId, resourceType) => {
  const baseUrl = '/search';
  const searchParams = {
    'resource-types': resourceType.parent
      ? resourceType.parent.id
      : resourceType.id,
    contextFilters: resourceType.parent ? resourceType.id : undefined,
    page: 1,
    subjects: subjectId,
  };
  return `${baseUrl}?${queryString.stringify(searchParams)}`;
};

export const SubjectPageSidebar = ({
  subjectId,
  subjectpage,
  resourceTypes,
  t,
}) => {
  const { editorsChoices, mostRead, topical } = subjectpage;

  const subjectMaterialResourceType = resourceTypes.find(
    type => type.id === 'urn:resourcetype:subjectMaterial',
  );

  const flattenResourceTypes = subjectMaterialResourceType.subtypes
    ? [
        subjectMaterialResourceType,
        ...subjectMaterialResourceType.subtypes.map(subtype => ({
          ...subtype,
          parent: subjectMaterialResourceType,
        })),
      ]
    : [];

  const mostReadResources = getResources(mostRead);

  return (
    <SubjectSidebarWrapper>
      <SubjectShortcuts
        messages={{
          heading: t('subjectPage.subjectShortcuts.heading'),
          showMore: t('subjectPage.subjectShortcuts.showMore'),
          showLess: t('subjectPage.subjectShortcuts.showLess'),
        }}
        links={flattenResourceTypes.map(type => ({
          text: type.name,
          url: getSearchUrl(subjectId, type),
        }))}
      />
      {mostRead && (
        <SubjectLinks
          heading={t('subjectPage.mostRead.heading')}
          links={mostReadResources.map(resource => ({
            text: resource.name,
            url: toSubjects() + resource.path,
          }))}
        />
      )}
      <SubjectEditorChoices narrowScreen editorsChoices={editorsChoices} />

      <SubjectTopical topical={topical} />
      <SubjectAbout
        media={
          <Image
            alt="Forstørrelsesglass"
            src="https://staging.api.ndla.no/image-api/raw/42-45210905.jpg"
          />
        }
        heading="Om medieuttrykk og mediesamfunnet"
        description="Her kan det komme en tekstlig beskrivelse av hvordan faget er bygget opp eller hvilke særpreg dette faget har. Det kan også være i form av en film som introduserer faget"
      />
    </SubjectSidebarWrapper>
  );
};
SubjectPageSidebar.propTypes = {
  subjectpage: GraphQLSubjectPageShape,
  resourceTypes: PropTypes.arrayOf(GraphqlResourceTypeWithsubtypesShape),
  subjectId: PropTypes.string.isRequired,
};

SubjectPageSidebar.defaultProps = {
  subjectpage: {},
  resourceTypes: [],
};

export default injectT(SubjectPageSidebar);
