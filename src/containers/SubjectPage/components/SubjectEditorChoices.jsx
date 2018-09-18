/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { SubjectCarousel } from 'ndla-ui';
import { injectT } from 'ndla-i18n';
import { GraphQLSubjectPageResourcesShape } from '../../../graphqlShapes';
import { getResources } from '../subjectPageHelpers';
import { toLinkProps } from '../../../routeHelpers';
import { hasContentUri } from '../../Resources/resourceHelpers';

const getResourceTypeName = (resource, t) => {
  if (resource.id.startsWith('urn:topic')) {
    return t('contentTypes.topic-article');
  }
  if (
    !resource ||
    !resource.resourceTypes ||
    resource.resourceTypes.length === 0
  ) {
    return t('subjectPage.editorsChoices.unknown');
  }
  return resource.resourceTypes[0].name;
};

const SubjectEditorChoices = ({
  editorsChoices,
  narrowScreen,
  wideScreen,
  t,
}) => {
  if (!editorsChoices) {
    return null;
  }

  const editorsChoicesResources = getResources(editorsChoices)
    .filter(hasContentUri)
    .map(resource => ({
      title: resource.name,
      image:
        resource.meta && resource.meta.metaImage
          ? resource.meta.metaImage.url
          : '',
      type: getResourceTypeName(resource, t),
      id: resource.meta ? resource.meta.id.toString() : '',
      text: resource.meta ? resource.meta.metaDescription : '',
      toLinkProps: () => toLinkProps(resource),
    }));

  if (editorsChoicesResources.length === 0) {
    return null;
  }

  return (
    <SubjectCarousel
      title={t('subjectPage.editorsChoices.heading')}
      subjects={editorsChoicesResources}
      wideScreen={wideScreen}
      narrowScreen={narrowScreen}
    />
  );
};

SubjectEditorChoices.propTypes = {
  editorsChoices: GraphQLSubjectPageResourcesShape,
  narrowScreen: PropTypes.bool,
  wideScreen: PropTypes.bool,
};

SubjectEditorChoices.defaultProps = {
  narrowScreen: false,
  wideScreen: false,
};

export default injectT(SubjectEditorChoices);
