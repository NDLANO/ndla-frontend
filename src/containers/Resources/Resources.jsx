/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ResourcesWrapper,
  ResourcesTopicTitle,
  ResourceGroup,
  ContentTypeBadge,
} from '@ndla/ui';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { contentTypeMapping } from '../../util/getContentType';
import { ResourceTypeShape, ResourceShape, TopicShape } from '../../shapes';
import { resourceToLinkProps as resourceToLinkPropsHelper } from './resourceHelpers';
import { getResourceGroups, sortResourceTypes } from './getResourceGroups';
import {
  TAXONOMY_CUSTOM_FIELD_TOPIC_RESOURCES,
  TAXONOMY_CUSTOM_FIELD_UNGROUPED_RESOURCE,
} from '../../constants';

class Resources extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAdditionalResources: false,
      showAdditionalDialog: false,
    };
    this.toggleAdditionalResources = this.toggleAdditionalResources.bind(this);
    this.toggleAdditionalDialog = this.toggleAdditionalDialog.bind(this);
  }

  componentDidMount() {
    const showAdditional = window
      ? window.localStorage.getItem('showAdditionalResources')
      : 'false';
    this.setState(prevState => ({
      showAdditionalResources: showAdditional === 'true',
    }));
  }

  toggleAdditionalResources() {
    this.setState(prevState => ({
      showAdditionalResources: !prevState.showAdditionalResources,
    }));
    window &&
      window.localStorage.setItem(
        'showAdditionalResources',
        `${!this.state.showAdditionalResources}`,
      );
  }

  toggleAdditionalDialog() {
    this.setState(prevState => ({
      showAdditionalDialog: !prevState.showAdditionalDialog,
    }));
  }

  render() {
    const { showAdditionalResources, showAdditionalDialog } = this.state;
    const {
      match: { params },
      t,
      topic,
      resourceTypes,
      locale,
      ndlaFilm,
    } = this.props;

    if (
      topic?.coreResources?.length === 0 &&
      topic?.supplementaryResources.length === 0
    ) {
      return null;
    }

    const resourceToLinkProps = resource =>
      resourceToLinkPropsHelper(resource, topic.path, locale);

    const { coreResources, supplementaryResources, metadata } = topic;

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
      ?.filter(
        resource => !coreResources?.find(core => core.id === resource.id),
      );

    const isUngrouped =
      metadata?.customFields[TAXONOMY_CUSTOM_FIELD_TOPIC_RESOURCES] ===
        TAXONOMY_CUSTOM_FIELD_UNGROUPED_RESOURCE || false;

    const sortedResources = [...coreResources, ...supplementary].sort(
      (a, b) => {
        return a.rank - b.rank;
      },
    );

    const ungroupedResources = sortedResources.map(resource => {
      const resourceTypes = sortResourceTypes(resource.resourceTypes);
      return {
        ...resource,
        active: resource.id.endsWith(params.resourceId) ? true : false,
        contentTypeName: resourceTypes?.[0]?.name,
        contentType: contentTypeMapping[resourceTypes?.[0]?.id],
      };
    });

    const groupedResources = getResourceGroups(
      resourceTypes,
      supplementaryResources,
      coreResources,
    );

    const hasAdditionalResources = supplementary?.length > 0;

    const resourceGroupsWithMetaData = groupedResources.map(type => ({
      ...type,
      resources: type.resources.map(resource => ({
        ...resource,
        active: resource.id.endsWith(params.resourceId) ? true : false,
      })),
      contentType: contentTypeMapping[type.id],
      noContentLabel: t('resource.noCoreResourcesAvailable', {
        name: type.name.toLowerCase(),
      }),
    }));

    return (
      <ResourcesWrapper
        invertedStyle={ndlaFilm}
        header={
          <ResourcesTopicTitle
            messages={{
              label: t('resource.label'),
              additionalFilterLabel: t('resource.activateAdditionalResources'),
              dialogTooltip: t('resource.dialogTooltip'),
              dialogHeading: t('resource.dialogHeading'),
              dialogTexts: [
                t('resource.dialogText1'),
                t('resource.dialogText2'),
              ],
            }}
            explainationIconLabelledBy="learning-resources-info-header-id"
            id="learning-resources-id"
            title={topic.name}
            toggleAdditionalResources={this.toggleAdditionalResources}
            showAdditionalResources={showAdditionalResources}
            hasAdditionalResources={hasAdditionalResources}
            toggleAdditionalDialog={this.toggleAdditionalDialog}
            showAdditionalDialog={showAdditionalDialog}
            invertedStyle={ndlaFilm}
          />
        }>
        {isUngrouped && (
          <ResourceGroup
            title=""
            resources={ungroupedResources}
            showAdditionalResources={showAdditionalResources}
            toggleAdditionalResources={this.toggleAdditionalResources}
            invertedStyle={ndlaFilm}
            resourceToLinkProps={resourceToLinkProps}
            unGrouped
          />
        )}
        {!isUngrouped &&
          resourceGroupsWithMetaData.map(type => (
            <ResourceGroup
              key={type.id}
              title={type.name}
              resources={type.resources}
              showAdditionalResources={showAdditionalResources}
              toggleAdditionalResources={this.toggleAdditionalResources}
              contentType={type.contentType}
              invertedStyle={ndlaFilm}
              icon={<ContentTypeBadge type={type.contentType} />}
              resourceToLinkProps={resourceToLinkProps}
            />
          ))}
      </ResourcesWrapper>
    );
  }
}

Resources.propTypes = {
  topic: TopicShape,
  resourceTypes: PropTypes.arrayOf(ResourceTypeShape),
  coreResources: PropTypes.arrayOf(ResourceShape),
  supplementaryResources: PropTypes.arrayOf(ResourceShape),
  match: PropTypes.shape({
    params: PropTypes.shape({
      topicId: PropTypes.string,
      topicPath: PropTypes.string,
      subjectId: PropTypes.string,
      resourceId: PropTypes.string,
    }),
  }),
  location: PropTypes.shape({ search: PropTypes.string.isRequired }),
  locale: PropTypes.string,
  ndlaFilm: PropTypes.bool,
};

export default withRouter(withTranslation()(Resources));
