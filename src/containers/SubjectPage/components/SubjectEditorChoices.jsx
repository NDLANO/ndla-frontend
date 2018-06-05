

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
import { getResources } from '../SubjectPage'
import {
  toSubjects,
} from '../../../routeHelpers';

const SubjectEditorChoices = ({ editorsChoices, narrowScreen, wideScreen, t }) => {
  if (!editorsChoices) {
    return null;
  }

  const editorsChoicesResources = getResources(editorsChoices).map(
    resource => ({
      title: resource.name,
      image: resource.meta ? resource.meta.metaImage : '',
      type:
        resource.resourceTypes && resource.resourceTypes.length > 1
          ? resource.resourceTypes[0].name
          : t('subjectPage.editorsChoices.unknown'),
      id: resource.meta ? resource.meta.id.toString() : '',
      text: resource.meta ? resource.meta.metaDescription : '',
      linkTo: toSubjects() + resource.path,
    }),
  );

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
}

export default injectT(SubjectEditorChoices);
