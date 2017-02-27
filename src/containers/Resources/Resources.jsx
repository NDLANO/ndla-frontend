/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component, PropTypes } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Tabs from 'ndla-tabs';
import { injectT } from '../../i18n';
import { toTopicResourceTab } from '../../routes';
import { getLearningPathResourcesByTopicId, getArticleResourcesByTopicId } from './resourceSelectors';
import ResourceList from './components/ResourceList';
import ResourceSubsetList from './components/ResourceSubsetList';
import { resourceToLinkProps } from './resourceHelpers';


function buildTabList(t, location, articleResources, learningPathResources) {
  const tabs = [];

  // Must be in same order as tabs after "all" tab
  const resourceGroups = [
    { title: t('resources.tabs.learningpaths'), viewAllLinkTitle: t('resources.links.viewAllLearningPaths'), resources: learningPathResources },
    { title: t('resources.tabs.subjectMaterial'), viewAllLinkTitle: t('resources.links.viewAllSubjectMaterials'), resources: articleResources },
  ];

  const toResourceTab = index => toTopicResourceTab(location, index + 1);

  tabs.push({
    key: 'all',
    displayName: t('resources.tabs.all'),
    content: <ResourceSubsetList resourceToLinkProps={resourceToLinkProps} toResourceTab={toResourceTab} resourceGroups={resourceGroups} />,
  });

  tabs.push({
    key: 'learningpaths',
    displayName: t('resources.tabs.learningpaths'),
    content: <ResourceList resourceToLinkProps={resourceToLinkProps} resources={learningPathResources} />,
  });
  tabs.push({
    key: 'subjectMaterial',
    displayName: t('resources.tabs.subjectMaterial'),
    content: <ResourceList resourceToLinkProps={resourceToLinkProps} resources={articleResources} />,
  });

  return tabs;
}


class Resources extends Component {
  componentWillMount() {
  }

  componentWillReceiveProps() {
  }

  render() {
    const { t, articleResources, learningPathResources, selectedResourceTabIndex } = this.props;
    const { router: { location } } = this.context;
    const tabs = buildTabList(t, location, articleResources, learningPathResources);
    return (
      <div className="u-margin-top-large">
        <Tabs tabs={tabs} selectedIndex={selectedResourceTabIndex} />
      </div>
    );
  }
}

Resources.propTypes = {
  articleResources: PropTypes.array,
  learningPathResources: PropTypes.array,
  selectedResourceTabIndex: PropTypes.number.isRequired,
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

Resources.contextTypes = {
  router: PropTypes.object,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  injectT,
)(Resources);
