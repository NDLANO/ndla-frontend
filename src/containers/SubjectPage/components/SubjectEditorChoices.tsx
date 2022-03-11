/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { SubjectCarousel } from '@ndla/ui';
import { TFunction, useTranslation } from 'react-i18next';
import { toLinkProps } from '../../../routeHelpers';
import { hasContentUri } from '../../Resources/resourceHelpers';
import {
  GQLMetaInfoFragment,
  GQLResource,
  GQLTaxonomyEntityInfoFragment,
} from '../../../graphqlTypes';
import { LocaleType } from '../../../interfaces';

const getResourceTypeName = (
  resource: Pick<GQLResource, 'id' | 'resourceTypes'>,
  t: TFunction,
) => {
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
  return resource?.resourceTypes[0]?.name;
};

interface Props {
  editorsChoices?: (GQLTaxonomyEntityInfoFragment & {
    meta?: GQLMetaInfoFragment;
  })[];
  narrowScreen?: boolean;
  wideScreen?: boolean;
  locale: LocaleType;
}

const SubjectEditorChoices = ({
  editorsChoices,
  narrowScreen = false,
  wideScreen = false,
}: Props) => {
  const { t } = useTranslation();
  if (!editorsChoices) {
    return null;
  }

  const editorsChoicesResources = editorsChoices
    .filter(x => x !== null)
    .filter(hasContentUri)
    .map(resource => ({
      id: resource.meta ? resource.meta.id.toString() : '',
      title: resource.name,
      text: resource.meta?.metaDescription ?? '',
      type: getResourceTypeName(resource, t),
      image: resource?.meta?.metaImage?.url,
      toLinkProps: () =>
        toLinkProps({
          path: resource.path || '',
          meta: resource.meta,
          contentUri: resource.contentUri,
        }),
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

export default SubjectEditorChoices;
