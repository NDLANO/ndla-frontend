/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withRouter from 'react-router-dom/withRouter';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { injectT } from 'ndla-i18n';
import { ResourceGroup } from 'ndla-ui';
import getResourceTypeMetaData from '../../components/getResourceTypeMetaData';
import { ResourceTypeShape } from '../../shapes';
import {
  getResourceTypesByTopicId,
  hasFetchTopicResourcesFailed,
} from './resource';
import { resourceToLinkProps as resourceToLinkPropsHelper } from './resourceHelpers';

class Resources extends Component {
  componentWillMount() {}

  componentWillReceiveProps() {}

  render() {
    const {
      match: { url },
      t,
      topicResourcesByType,
      fetchTopicResourcesFailed,
    } = this.props;
    const subjectTopicPath = url.replace('/subjects/', '');

    const resourceToLinkProps = resource =>
      resourceToLinkPropsHelper(resource, subjectTopicPath);
    const topicResourcesByTypeWithMetaData = topicResourcesByType.map(type => ({
      ...type,
      meta: getResourceTypeMetaData([type]),
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
            className={type.meta.resourceListClassName}
            icon={type.meta.icon}
            messages={{
              noCoreResourcesAvailable: t('resource.noCoreResourcesAvailable'),
              activateSuggestion: t('resource.activateSuggestion'),
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
  }
}

Resources.propTypes = {
  topicResourcesByType: PropTypes.arrayOf(ResourceTypeShape),
  fetchTopicResourcesFailed: PropTypes.bool.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      subjectId: PropTypes.string.isRequired,
      topicId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

const mapStateToProps = (state, ownProps) => {
  const { topicId } = ownProps;
  return {
    topicResourcesByType: getResourceTypesByTopicId(topicId)(state),
    fetchTopicResourcesFailed: hasFetchTopicResourcesFailed(state),
  };
};

export default compose(withRouter, injectT, connect(mapStateToProps))(
  Resources,
);
