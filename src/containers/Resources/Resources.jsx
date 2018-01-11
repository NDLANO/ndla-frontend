/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { injectT } from 'ndla-i18n';
import { ResourceGroup, ContentTypeBadge } from 'ndla-ui';
import getContentTypeFromResourceTypes from '../../components/getContentTypeFromResourceTypes';
import { ResourceTypeShape } from '../../shapes';
import {
  getResourceTypesByTopicId,
  hasFetchTopicResourcesFailed,
} from './resource';
import { resourceToLinkProps } from './resourceHelpers';

const Resources = ({ t, topicResourcesByType, fetchTopicResourcesFailed }) => {
  const topicResourcesByTypeWithMetaData = topicResourcesByType.map(type => ({
    ...type,
    contentType: getContentTypeFromResourceTypes([type]).contentType,
  }));
  return (
    <div>
      {fetchTopicResourcesFailed && (
        <p style={{ border: '1px solid #eff0f2', padding: '13px' }}>
          {t('resource.errorDescription')}
        </p>
      )}
      {topicResourcesByTypeWithMetaData.map(type => (
        <ResourceGroup
          key={type.id}
          title={type.name}
          resources={type.resources}
          contentType={type.contentType}
          icon={<ContentTypeBadge type={type.contentType} />}
          messages={{
            noCoreResourcesAvailable: t('resource.noCoreResourcesAvailable'),
            activateAdditionalResources: t(
              'resource.activateAdditionalResources',
            ),
            toggleFilterLabel: t('resource.toggleFilterLabel'),
            showLess: t('resource.showLess'),
            showMore: t('resource.showMore'),
          }}
          resourceToLinkProps={resourceToLinkProps}
        />
      ))}
    </div>
  );
};

Resources.propTypes = {
  topicId: PropTypes.string.isRequired,
  topicResourcesByType: PropTypes.arrayOf(ResourceTypeShape),
  fetchTopicResourcesFailed: PropTypes.bool.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  const { topicId } = ownProps;
  return {
    topicResourcesByType: getResourceTypesByTopicId(topicId)(state),
    fetchTopicResourcesFailed: hasFetchTopicResourcesFailed(state),
  };
};

export default compose(injectT, connect(mapStateToProps))(Resources);
