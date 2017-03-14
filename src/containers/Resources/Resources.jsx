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
import Tabs from 'ndla-tabs';
import { ResourceList, ResourceSubsetList } from 'ndla-ui';
import { injectT } from '../../i18n';
import { toTopicResourceTab } from '../../routes';
import { ResourceShape } from '../../shapes';
import { getLearningPathResourcesByTopicId, getArticleResourcesByTopicId } from './resourceSelectors';
import { resourceToLinkProps } from './resourceHelpers';


function buildTabList(t, location, articleResources, learningPathResources) {
  // Must be in same order as tabs after "all" tab
  const resourceGroups = [
    { title: t('resources.tabs.learningpaths'), viewAllLinkTitle: t('resources.links.viewAllLearningPaths'), resources: learningPathResources.slice(0, 2) },
    { title: t('resources.tabs.subjectMaterial'), viewAllLinkTitle: t('resources.links.viewAllSubjectMaterials'), resources: articleResources.slice(0, 2) },
  ];

  const toResourceTab = index => toTopicResourceTab(location, index + 1);

  return [
    {
      title: t('resources.tabs.all'),
      content: <ResourceSubsetList resourceToLinkProps={resourceToLinkProps} toResourceTab={toResourceTab} resourceGroups={resourceGroups} />,
    },

    {
      title: t('resources.tabs.learningpaths'),
      content: <ResourceList resourceToLinkProps={resourceToLinkProps} resources={learningPathResources} />,
    },
    {
      title: t('resources.tabs.subjectMaterial'),
      content: <ResourceList resourceToLinkProps={resourceToLinkProps} resources={articleResources} />,
    },

  ];
}


class Resources extends Component {
  componentWillMount() {
  }

  componentWillReceiveProps() {
  }

  render() {
    const { t, articleResources, router, learningPathResources } = this.props;
    const { location } = router;
    const tabs = buildTabList(t, location, articleResources, learningPathResources);

    const selectedResourceTabIndex = location.query.resourceTabIndex ? parseInt(location.query.resourceTabIndex, 10) : 0;

    return (
      <div className="u-margin-top-huge">
        <Tabs
          modifier="muted"
          tabs={tabs}
          onSelect={(index) => { router.push({ ...location, query: { resourceTabIndex: index } }); }}
          selectedIndex={selectedResourceTabIndex}
        />
      </div>
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
