/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { ResourceList } from 'ndla-ui';
import { ResourceTypeShape } from '../../shapes';
import { getResourceTypesByTopicId } from './resourceSelectors';
import { resourceToLinkProps as resourceToLinkPropsHelper } from './resourceHelpers';


class Resources extends Component {
  componentWillMount() {
  }

  componentWillReceiveProps() {
  }

  render() {
    const { router, topicResourcesByType } = this.props;
    const { params } = router;

    const resourceToLinkProps = resource => resourceToLinkPropsHelper(resource, params.subjectId, params.topicId);

    return (
      <div>
        {topicResourcesByType.map(type => (
          <div key={type.id}>
            <h1>{type.name}</h1>
            <ResourceList resourceToLinkProps={resourceToLinkProps} resources={type.resources.map(resource => ({ ...resource, icon: 'Pencil' }))} />
          </div>),
        )
        }
      </div>
    );
  }
}

Resources.propTypes = {
  topicResourcesByType: PropTypes.arrayOf(ResourceTypeShape),
  router: PropTypes.shape({
    params: PropTypes.shape({
      subjectId: PropTypes.string.isRequired,
      topicId: PropTypes.string,
    }).isRequired,
  }),
};

const mapStateToProps = (state, ownProps) => {
  const { topicId } = ownProps;
  return ({
    topicResourcesByType: getResourceTypesByTopicId(topicId)(state),
  });
};

export default compose(
  connect(mapStateToProps),
  withRouter,
)(Resources);
