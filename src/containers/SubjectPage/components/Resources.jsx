/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Tabs from 'ndla-tabs';
import { getSubtopicsWithDescription } from '../subjectSelectors';
import * as actions from '../../ArticlePage/articleActions';
import { injectT } from '../../../i18n';
import TopicDescriptionList from './TopicDescriptionList';
import { TopicShape } from '../../../shapes';


function buildLicenseTabList(t, topics, subjectId) {
  const tabs = [];

  tabs.push({ key: 'topics', displayName: t('resources.tabs.topics'), content: <TopicDescriptionList subjectId={subjectId} topics={topics} /> });
  tabs.push({ key: 'learningresources', displayName: t('resources.tabs.learningresources'), content: <p>Læringsressurser</p> });

  return tabs;
}


class Resources extends Component {
  componentWillMount() {
    if (this.props.topics.length > 0) {
      const ids = this.props.topics
          .filter(t => t.contentUri)
          .map(t => t.contentUri.replace('urn:article:', ''));
      this.props.fetchArticles(ids);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.topics.length > 0 && nextProps.topics !== this.props.topics) {
      const ids = nextProps.topics
          .filter(t => t.contentUri)
          .map(t => t.contentUri.replace('urn:article:', ''));
      this.props.fetchArticles(ids);
    }
  }

  render() {
    const { topics, subjectId, t } = this.props;
    const tabs = buildLicenseTabList(t, topics, subjectId);
    // console.log(this.props.subtopics);
    return (
      <div className="c-resources u-margin-top-large">
        <Tabs tabs={tabs} />
      </div>
    );
  }
}

Resources.propTypes = {
  subjectId: PropTypes.string.isRequired,
  fetchArticles: PropTypes.func.isRequired,
  topics: PropTypes.arrayOf(TopicShape).isRequired,
};

const mapDispatchToProps = {
  fetchArticles: actions.fetchArticles,
};

const mapStateToProps = (state, ownProps) => {
  const { subjectId, topicId } = ownProps;
  return ({
    topics: getSubtopicsWithDescription(subjectId, topicId)(state),
  });
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  injectT,
)(Resources);
