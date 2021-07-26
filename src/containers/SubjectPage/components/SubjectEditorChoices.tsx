/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
// @ts-ignore
import { SubjectCarousel } from '@ndla/ui';
import { injectT, tType } from '@ndla/i18n';
import { toLinkProps } from '../../../routeHelpers';
import { hasContentUri } from '../../Resources/resourceHelpers';
import { GQLResource, GQLTaxonomyEntity } from '../../../graphqlTypes';
import { LocaleType } from '../../../interfaces';

const getResourceTypeName = (resource: GQLResource, t: tType['t']) => {
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
  return resource.resourceTypes[0]!.name;
};

interface Props {
  editorsChoices: Array<GQLTaxonomyEntity | null> | undefined;
  narrowScreen?: boolean;
  wideScreen?: boolean;
  locale: LocaleType;
}

const SubjectEditorChoices = ({
  editorsChoices,
  narrowScreen = false,
  wideScreen = false,
  t,
}: Props & tType) => {
  if (!editorsChoices) {
    return null;
  }

  const editorsChoicesResources = editorsChoices
    .filter(x => x !== null)
    .filter(hasContentUri)
    //@ts-ignore
    .map((resource: GQLTaxonomyEntity) => ({
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

export default injectT(SubjectEditorChoices);
