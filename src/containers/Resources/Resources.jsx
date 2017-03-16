/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component, PropTypes } from 'react';
import { withRouter, Link } from 'react-router';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { ResourceList, ResourceSubsetList } from 'ndla-ui';
import { injectT } from '../../i18n';
import { toTopicResourceTab } from '../../routes';
import { ResourceShape } from '../../shapes';
import { getLearningPathResourcesByTopicId, getArticleResourcesByTopicId } from './resourceSelectors';
import { resourceToLinkProps as resourceToLinkPropsHelper } from './resourceHelpers';


class Resources extends Component {
  componentWillMount() {
  }

  componentWillReceiveProps() {
  }

  render() {
    const { t, articleResources, router, learningPathResources } = this.props;
    const { location, params } = router;

    const selectedResourceTabIndex = location.query.resourceTabIndex ? parseInt(location.query.resourceTabIndex, 10) : 0;

    const resourceGroups = [
      {
        title: t('resources.tabs.subjectMaterial'),
        description: t('resources.subjectMaterial.description'),
        viewAllLinkTitle: t('resources.links.viewAllSubjectMaterials'),
        resources: articleResources.slice(0, 2),
        color: 'red',
      },
      {
        title: t('resources.tabs.learningpaths'),
        description: t('resources.learningpaths.description'),
        viewAllLinkTitle: t('resources.links.viewAllLearningPaths'),
        resources: learningPathResources.slice(0, 2),
        color: 'blue',
      },
      {
        title: t('resources.tasks.title'),
        description: t('resources.tasks.description'),
        viewAllLinkTitle: t('resources.links.viewAllLearningPaths'),
        resources: articleResources.slice(-2).map(resource => ({ ...resource, icon: 'Pencil' })),
        color: 'green',
      },
    ];

    const resourceToLinkProps = resource => resourceToLinkPropsHelper(resource, params.subjectId, params.topicId);
    const toResourceTab = index => toTopicResourceTab(location, index + 1);

    if (selectedResourceTabIndex === 1) {
      return (
        <div className="c-topic-resource-subset c-topic-resource-subset--red">
          <ResourceList resourceToLinkProps={resourceToLinkProps} resources={articleResources} />
          <Link to={toResourceTab(-1)}>Tilbake</Link>
        </div>
      );
    } else if (selectedResourceTabIndex === 2) {
      return (
        <div className="c-topic-resource-subset c-topic-resource-subset--blue">
          <ResourceList resourceToLinkProps={resourceToLinkProps} resources={learningPathResources} />
          <Link to={toResourceTab(-1)}>Tilbake</Link>
        </div>
      );
    } else if (selectedResourceTabIndex === 3) {
      return (
        <div className="c-topic-resource-subset c-topic-resource-subset--green">
          <ResourceList resourceToLinkProps={resourceToLinkProps} resources={articleResources.map(resource => ({ ...resource, icon: 'Pencil' }))} />
          <Link to={toResourceTab(-1)}>Tilbake</Link>
        </div>
      );
    }

    return (
      <ResourceSubsetList resourceToLinkProps={resourceToLinkProps} toResourceTab={toResourceTab} resourceGroups={resourceGroups} />
    );
  }
}

Resources.propTypes = {
  articleResources: PropTypes.arrayOf(ResourceShape),
  learningPathResources: PropTypes.arrayOf(ResourceShape),
  router: PropTypes.shape({
    location: PropTypes.shape({
      query: PropTypes.shape({
        resourceTabIndex: PropTypes.string,
      }),
    }).isRequired,
    params: PropTypes.shape({
      subjectId: PropTypes.string.isRequired,
      topicId: PropTypes.string,
    }).isRequired,
    push: PropTypes.func.isRequired,
  }),
};

const mapDispatchToProps = {
};

const mapStateToProps = (state, ownProps) => {
  const { topicId } = ownProps;
  return ({
    articleResources: getArticleResourcesByTopicId(topicId)(state),
    learningPathResources: getLearningPathResourcesByTopicId(topicId)(state),
  });
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  injectT,
  withRouter,
)(Resources);
