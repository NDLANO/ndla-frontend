/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectT } from 'ndla-i18n';
import { compose } from 'react-apollo';
import {
  ResourcesWrapper,
  ResourcesTopicTitle,
  ResourceGroup,
  ContentTypeBadge,
} from 'ndla-ui';
import { withRouter } from 'react-router-dom';
import getContentTypeFromResourceTypes from '../../util/getContentTypeFromResourceTypes';
import { ResourceTypeShape, ResourceShape } from '../../shapes';
import { resourceToLinkProps as resourceToLinkPropsHelper } from './resourceHelpers';
import { getResourceGroups } from './getResourceGroups';
import { getFiltersFromUrl } from '../../util/filterHelper';

function getSubjectTopicPath(params) {
  const topicPath = params.topicPath ? `${params.topicPath}/` : '';
  return `/${params.subjectId}/${topicPath}${params.topicId}`;
}

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

  toggleAdditionalResources() {
    this.setState(prevState => ({
      showAdditionalResources: !prevState.showAdditionalResources,
    }));
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
      title,
      resourceTypes,
      supplementaryResources,
      coreResources,
      location,
    } = this.props;

    const subjectTopicPath = getSubjectTopicPath(params);
    const resourceToLinkProps = resource =>
      resourceToLinkPropsHelper(
        resource,
        subjectTopicPath,
        getFiltersFromUrl(location),
      );
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

    const resourceGroups = getResourceGroups(
      resourceTypes,
      supplementaryResources || [],
      coreResources || [],
    );

    const hasAdditionalResources = resourceGroups.some(group =>
      group.resources.some(resource => resource.additional),
    );

    const resourceGroupsWithMetaData = resourceGroups.map(type => ({
      ...type,
      contentType: getContentTypeFromResourceTypes([type]).contentType,
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
              dialogTooltip: t('resource.dialogTooltip'),
              dialogHeading: t('resource.dialogHeading'),
              dialogTexts: [
                t('resource.dialogText1'),
                t('resource.dialogText2'),
              ],
            }}
            explainationIconLabelledBy="learning-resources-info-header-id"
            id="learning-resources-id"
            title={title}
            toggleAdditionalResources={this.toggleAdditionalResources}
            showAdditionalResources={showAdditionalResources}
            hasAdditionalResources={hasAdditionalResources}
            toggleAdditionalDialog={this.toggleAdditionalDialog}
            showAdditionalDialog={showAdditionalDialog}
          />
        }>
        {resourceGroupsWithMetaData.map(type => (
          <ResourceGroup
            key={type.id}
            title={type.name}
            resources={type.resources}
            showAdditionalResources={showAdditionalResources}
            toggleAdditionalResources={this.toggleAdditionalResources}
            contentType={type.contentType}
            icon={<ContentTypeBadge type={type.contentType} />}
            messages={{
              noContentBoxLabel: type.noContentLabel,
              noContentBoxButtonText: t('resource.activateAdditionalResources'),
              toggleFilterLabel: t('resource.toggleFilterLabel'),
              coreTooltip: t('resource.tooltipCoreTopic'),
              additionalTooltip: t('resource.tooltipAdditionalTopic'),
            }}
            resourceToLinkProps={resourceToLinkProps}
          />
        ))}
      </ResourcesWrapper>
    );
  }
}

Resources.propTypes = {
  title: PropTypes.string.isRequired,
  resourceTypes: PropTypes.arrayOf(ResourceTypeShape),
  coreResources: PropTypes.arrayOf(ResourceShape),
  supplementaryResources: PropTypes.arrayOf(ResourceShape),
  match: PropTypes.shape({
    params: PropTypes.shape({
      topicId: PropTypes.string,
      topicPath: PropTypes.string,
      subjectId: PropTypes.string,
    }),
  }),
  location: PropTypes.shape({ search: PropTypes.string.isRequired }),
};

export default compose(
  withRouter,
  injectT,
)(Resources);
