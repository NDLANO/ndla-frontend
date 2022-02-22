/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect, useState } from 'react';
import { ResourcesWrapper, ResourcesTopicTitle, ResourceGroup } from '@ndla/ui';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { contentTypeMapping } from '../../util/getContentType';
import { getResourceGroups, sortResourceTypes } from './getResourceGroups';
import {
  TAXONOMY_CUSTOM_FIELD_TOPIC_RESOURCES,
  TAXONOMY_CUSTOM_FIELD_UNGROUPED_RESOURCE,
} from '../../constants';
import {
  GQLResource,
  GQLResourceType,
  GQLTopicQueryTopicFragment,
} from '../../graphqlTypes';

interface MatchProps {
  topicId?: string;
  topicPath?: string;
  subjectId?: string;
  resourceId?: string;
}

interface ResourcesTopic extends Omit<GQLTopicQueryTopicFragment, 'metadata'> {
  metadata?: GQLTopicQueryTopicFragment['metadata'];
}

interface Props extends RouteComponentProps<MatchProps> {
  topic: ResourcesTopic;
  resourceTypes?: Pick<GQLResourceType, 'id' | 'name'>[];
  coreResources?: GQLResource[];
  supplementaryResources?: GQLResource[];
  ndlaFilm?: boolean;
}
const Resources = ({
  match: { params },
  topic,
  resourceTypes,
  ndlaFilm,
}: Props) => {
  const [showAdditionalResources, setShowAdditionalResources] = useState(false);
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

  return (
    <ResourcesWrapper
      header={
        <ResourcesTopicTitle
          messages={{
            label: t('resource.label'),
            additionalFilterLabel: t('resource.activateAdditionalResources'),
          }}
          title={topic.name}
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
          // bad type, never called but required
          onClick={() => {}}
        />
      )}
      {!isUngrouped &&
        resourceGroupsWithMetaData.map(type => (
          <ResourceGroup
            key={type.id}
            title={type.name}
            resources={type.resources ?? []}
            showAdditionalResources={showAdditionalResources}
            toggleAdditionalResources={toggleAdditionalResources}
            contentType={type.contentType}
            invertedStyle={ndlaFilm}
            // bad type, never called but required.
            onClick={() => {}}
          />
        ))}
    </ResourcesWrapper>
  );
};

export default withRouter(Resources);
