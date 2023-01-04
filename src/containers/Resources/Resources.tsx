/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from '@apollo/client';
import { useEffect, useState } from 'react';
import { ResourcesWrapper, ResourceGroup } from '@ndla/ui';
import { useTranslation } from 'react-i18next';
import { contentTypeMapping } from '../../util/getContentType';
import { getResourceGroups, sortResourceTypes } from './getResourceGroups';
import {
  TAXONOMY_CUSTOM_FIELD_TOPIC_RESOURCES,
  TAXONOMY_CUSTOM_FIELD_UNGROUPED_RESOURCE,
} from '../../constants';
import {
  GQLResources_ResourceTypeDefinitionFragment,
  GQLResources_TopicFragment,
} from '../../graphqlTypes';
import { TypedParams, useIsNdlaFilm, useTypedParams } from '../../routeHelpers';
import AddResourceToFolderModal from '../../components/MyNdla/AddResourceToFolderModal';
import { ResourceAttributes } from '../../components/MyNdla/AddResourceToFolder';
import FavoriteButton from '../../components/Article/FavoritesButton';
import ResourcesTopicTitle from './ResourcesTopicTitle';
import { HeadingType } from '../../interfaces';

interface MatchProps extends TypedParams {
  topicId?: string;
  topicPath?: string;
  subjectId?: string;
  resourceId?: string;
}

interface Props {
  topic: GQLResources_TopicFragment;
  resourceTypes?: GQLResources_ResourceTypeDefinitionFragment[];
  headingType: HeadingType;
  subHeadingType: HeadingType;
}
const Resources = ({
  topic,
  resourceTypes,
  headingType,
  subHeadingType,
}: Props) => {
  const params = useTypedParams<MatchProps>();
  const [showAdditionalResources, setShowAdditionalResources] = useState(false);
  const [resourceToAdd, setResourceToAdd] = useState<
    ResourceAttributes | undefined
  >(undefined);
  const ndlaFilm = useIsNdlaFilm();
  const { t } = useTranslation();

  useEffect(() => {
    let showAdditional: string | null = 'false';
    if (window) {
      showAdditional = window.localStorage.getItem('showAdditionalResources');
    }
    setShowAdditionalResources(showAdditional === 'true');
  }, []);

  const toggleAdditionalResources = () => {
    const newShow = !showAdditionalResources;
    setShowAdditionalResources(newShow);
    window?.localStorage.setItem('showAdditionalResources', `${newShow}`);
  };

  if (
    topic.coreResources &&
    topic.coreResources.length === 0 &&
    topic.supplementaryResources &&
    topic.supplementaryResources.length === 0
  ) {
    return null;
  }

  const { coreResources = [], supplementaryResources = [], metadata } = topic;

  if (
    resourceTypes === null ||
    (coreResources === null && supplementaryResources === null)
  ) {
    return (
      <p style={{ border: '1px solid #eff0f2', padding: '13px' }}>
        {t('resource.errorDescription')}
      </p>
    );
  }

  // add additional flag and filter from core
  const supplementary = supplementaryResources
    ?.map(resource => ({
      ...resource,
      additional: true,
    }))
    ?.filter(resource => !coreResources?.find(core => core.id === resource.id));

  const isUngrouped =
    metadata?.customFields[TAXONOMY_CUSTOM_FIELD_TOPIC_RESOURCES] ===
      TAXONOMY_CUSTOM_FIELD_UNGROUPED_RESOURCE || false;

  const sortedResources = [...coreResources, ...supplementary].sort((a, b) => {
    if (!a.rank && !b.rank) {
      return 0;
    } else if (!a.rank) {
      return +1;
    } else if (!b.rank) {
      return -1;
    } else return a.rank - b.rank;
  });

  const ungroupedResources = sortedResources.map(resource => {
    const resourceTypes = sortResourceTypes(resource.resourceTypes ?? []);
    const firstResourceType = resourceTypes?.[0];
    return {
      ...resource,
      active:
        params.resourceId && resource.id.endsWith(params.resourceId)
          ? true
          : false,
      contentTypeName: firstResourceType?.name,
      contentType: firstResourceType
        ? contentTypeMapping[firstResourceType.id]
        : undefined,
    };
  });

  const groupedResources = getResourceGroups(
    resourceTypes ?? [],
    supplementaryResources,
    coreResources,
  );

  const hasAdditionalResources = supplementary?.length > 0;

  const resourceGroupsWithMetaData = groupedResources.map(type => ({
    ...type,
    resources: type?.resources?.map(resource => ({
      ...resource,
      active:
        params.resourceId && resource.id.endsWith(params.resourceId)
          ? true
          : false,
    })),
    contentType: contentTypeMapping[type.id],
    noContentLabel: t('resource.noCoreResourcesAvailable', {
      name: type.name.toLowerCase(),
    }),
  }));

  const onToggleAddToFavorites = (contentUri?: string, path?: string) => {
    const [, resourceType, articleIdString] = contentUri?.split(':') ?? [];
    const articleId = articleIdString ? parseInt(articleIdString) : undefined;
    if (!resourceType || !articleId || !path) return;
    setResourceToAdd({ id: articleId, path, resourceType });
  };

  return (
    <ResourcesWrapper
      header={
        <ResourcesTopicTitle
          heading={headingType}
          title={t('resource.label')}
          subTitle={topic.name}
          toggleAdditionalResources={toggleAdditionalResources}
          showAdditionalResources={showAdditionalResources}
          hasAdditionalResources={hasAdditionalResources}
          invertedStyle={ndlaFilm}
        />
      }>
      {isUngrouped && (
        <ResourceGroup
          resources={ungroupedResources}
          showAdditionalResources={showAdditionalResources}
          toggleAdditionalResources={toggleAdditionalResources}
          invertedStyle={ndlaFilm}
          heartButton={p => (
            <FavoriteButton
              path={p}
              onClick={() => {
                const resource = ungroupedResources?.find(r => r.path === p);
                onToggleAddToFavorites(resource?.contentUri, resource?.path);
              }}
            />
          )}
        />
      )}
      {!isUngrouped &&
        resourceGroupsWithMetaData.map(type => (
          <ResourceGroup
            key={type.id}
            headingLevel={subHeadingType}
            title={type.name}
            resources={type.resources ?? []}
            showAdditionalResources={showAdditionalResources}
            toggleAdditionalResources={toggleAdditionalResources}
            contentType={type.contentType}
            invertedStyle={ndlaFilm}
            heartButton={p => (
              <FavoriteButton
                path={p}
                onClick={() => {
                  const resource = ungroupedResources?.find(r => r.path === p);
                  onToggleAddToFavorites(resource?.contentUri, resource?.path);
                }}
              />
            )}
          />
        ))}
      <AddResourceToFolderModal
        isOpen={!!resourceToAdd}
        onClose={() => setResourceToAdd(undefined)}
        resource={resourceToAdd!}
      />
    </ResourcesWrapper>
  );
};

const resourceFragment = gql`
  fragment Resources_Resource on Resource {
    id
    name
    contentUri
    path
    paths
    rank
    resourceTypes {
      id
      name
    }
  }
`;

Resources.fragments = {
  resourceType: gql`
    fragment Resources_ResourceTypeDefinition on ResourceTypeDefinition {
      id
      name
    }
  `,
  topic: gql`
    fragment Resources_Topic on Topic {
      name
      coreResources(subjectId: $subjectId) {
        ...Resources_Resource
      }
      supplementaryResources(subjectId: $subjectId) {
        ...Resources_Resource
      }
      metadata {
        customFields
      }
    }
    ${resourceFragment}
  `,
};

export default Resources;
