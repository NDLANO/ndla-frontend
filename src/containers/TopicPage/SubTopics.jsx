/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  ResourcesWrapper,
  ResourcesTopicTitle,
  TopicIntroductionList,
} from '@ndla/ui';
import { withRouter } from 'react-router-dom';
import { injectT } from '@ndla/i18n';
import { TopicShape, LocationShape } from '../../shapes';
import { toTopicPartial } from '../../routeHelpers';
import { topicIntroductionMessages } from '../../util/topicsHelper';

const toTopic = (subjectId, topicPath) => {
  const topicIds = topicPath.map(topic => topic.id);
  return toTopicPartial(subjectId, ...topicIds);
};

class TopicResources extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAdditionalCores: false,
      showAdditionalDialog: false,
    };
    this.toggleAdditionalCores = this.toggleAdditionalCores.bind(this);
    this.toggleAdditionalDialog = this.toggleAdditionalDialog.bind(this);
  }

  toggleAdditionalCores() {
    this.setState(prevState => ({
      showAdditionalCores: !prevState.showAdditionalCores,
    }));
  }

  toggleAdditionalDialog() {
    this.setState(prevState => ({
      showAdditionalDialog: !prevState.showAdditionalDialog,
    }));
  }

  render() {
    const {
      topicTitle,
      subtopics,
      subjectId,
      topicPath,
      ndlaFilm,
      t,
    } = this.props;
    const { showAdditionalCores, showAdditionalDialog } = this.state;

    if (subtopics.length === 0) {
      return null;
    }
    return (
      <ResourcesWrapper
        invertedStyle={ndlaFilm}
        header={
          <ResourcesTopicTitle
            messages={{
              label: t('topicPage.topics'),
              additionalFilterLabel: t('resource.activateAdditionalResources'),
              /* dialogTooltip: t('resource.dialogTooltip'),
              dialogHeading: t('resource.dialogHeading'),
              dialogTexts: [
                t('resource.dialogText1'),
                t('resource.dialogText2'),
              ],
              */
            }}
            explainationIconLabelledBy="subject-header-id"
            title={topicTitle}
            hasAdditionalResources={false} // subtopics.some(topic => topic.additional)
            toggleAdditionalResources={this.toggleAdditionalCores}
            showAdditionalResources={showAdditionalCores}
            toggleAdditionalDialog={this.toggleAdditionalDialog}
            showAdditionalDialog={showAdditionalDialog}
            invertedStyle={ndlaFilm}
          />
        }>
        <TopicIntroductionList
          toTopic={toTopic(subjectId, topicPath)}
          topics={subtopics.map(topic => ({
            ...topic,
            introduction: topic.meta ? topic.meta.metaDescription : '',
          }))}
          messages={topicIntroductionMessages(t)}
          toggleAdditionalCores={() => {}}
        />
      </ResourcesWrapper>
    );
  }
}

TopicResources.propTypes = {
  topicTitle: PropTypes.string.isRequired,
  subjectId: PropTypes.string.isRequired,
  topicPath: PropTypes.arrayOf(TopicShape).isRequired,
  subtopics: PropTypes.arrayOf(TopicShape).isRequired,
  location: LocationShape,
  ndlaFilm: PropTypes.bool,
};

export default withRouter(injectT(TopicResources));
