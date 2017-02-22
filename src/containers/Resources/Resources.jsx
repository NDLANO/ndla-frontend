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
import { getLearningPathResourcesByTopicId, getArticleResourcesByTopicId } from './resourceSelectors';


function buildTabList(t) {
  const tabs = [];

  tabs.push({ key: 'all', displayName: t('resources.tabs.all'), content: <p>Alle</p> });
  tabs.push({ key: 'learningpaths', displayName: t('resources.tabs.learningpaths'), content: <p>Læringsstier</p> });
  tabs.push({ key: 'subjectMaterial', displayName: t('resources.tabs.subjectMaterial'), content: <p>Fagstoff</p> });
  tabs.push({ key: 'activities', displayName: t('resources.tabs.activities'), content: <p>Aktiviteter</p> });

  return tabs;
}


class Resources extends Component {
  componentWillMount() {
  }

  componentWillReceiveProps() {
  }

  render() {
    const { t, articleResources, learningPathResources } = this.props;
    const tabs = buildTabList(t, articleResources, learningPathResources);
    return (
      <div className="u-margin-top-large">
        <Tabs tabs={tabs} />
      </div>
    );
  }
}

Resources.propTypes = {
  articleResources: PropTypes.array,
  learningPathResources: PropTypes.array,
};

const mapDispatchToProps = {
  // fetchTopicResources: actions.fetchTopicResources,
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
)(Resources);
