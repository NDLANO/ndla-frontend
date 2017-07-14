/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import withRouter from 'react-router-dom/withRouter';
import { connect } from 'react-redux';
import ResourceList from './ResourceList';
import getResourceTypeMetaData from '../../components/getResourceTypeMetaData';
import { ResourceTypeShape } from '../../shapes';
import { getResourceTypesByTopicId } from './resource';
import { resourceToLinkProps as resourceToLinkPropsHelper } from './resourceHelpers';

const resClasses = new BEMHelper({
  name: 'resource-group',
  prefix: 'c-',
});

const ResourceType = ({ type, resourceToLinkProps }) => {
  const metaData = getResourceTypeMetaData([type]);
  return (
    <div key={type.id} {...resClasses('', '', metaData.resourceListClassName)}>
      <h1 className="c-resources__title">
        {type.name}
      </h1>
      <ResourceList
        icon={metaData.icon}
        resourceToLinkProps={resourceToLinkProps}
        resources={type.resources.map(resource => ({
          ...resource,
          icon: metaData.icon,
        }))}
      />
    </div>
  );
};

ResourceType.propTypes = {
  type: ResourceTypeShape.isRequired,
  resourceToLinkProps: PropTypes.func.isRequired,
};

class Resources extends Component {
  componentWillMount() {}

  componentWillReceiveProps() {}

  render() {
    const { match: { params }, topicResourcesByType } = this.props;

    const resourceToLinkProps = resource =>
      resourceToLinkPropsHelper(resource, params.subjectId, params.topicId);

    return (
      <div>
        {topicResourcesByType.map(type =>
          <ResourceType
            key={type.id}
            resourceToLinkProps={resourceToLinkProps}
            type={type}
          />,
        )}
      </div>
    );
  }
}

Resources.propTypes = {
  topicResourcesByType: PropTypes.arrayOf(ResourceTypeShape),
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
  };
};

export default withRouter(connect(mapStateToProps)(Resources));
