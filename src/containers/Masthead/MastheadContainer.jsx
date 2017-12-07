/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import {
  BreadcrumbBlock,
  DisplayOnPageYOffset,
  Masthead,
  MastheadItem,
  Logo,
  ClickToggle,
  TopicMenu,
} from 'ndla-ui';
import { injectT } from 'ndla-i18n';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { toTopic, toSubject } from '../../routeHelpers';
import { getSubjectById } from '../SubjectPage/subjects';
import { getSubjectMenu, getTopicPath } from '../TopicPage/topic';
import { SubjectShape, TopicShape } from '../../shapes';

function toTopicWithSubjectIdBound(subjectId) {
  return toTopic.bind(undefined, subjectId);
}

const MastheadContainer = ({ t, subject, topics, topicPath }) => (
  <Masthead fixed>
    <MastheadItem left>
      {subject ? (
        <ClickToggle
          title={t('masthead.menu.title')}
          openTitle={t('masthead.menu.close')}
          className="c-topic-menu-container"
          buttonClassName="c-btn c-button--outline c-topic-menu-toggle-button">
          <TopicMenu
            toSubject={() => toSubject(subject.id)}
            subjectTitle={subject.name}
            toTopic={toTopicWithSubjectIdBound(subject.id)}
            topics={topics}
            messages={{
              goTo: t('masthead.menu.goTo'),
              subjectOverview: t('masthead.menu.subjectOverview'),
              search: t('masthead.menu.search'),
            }}
          />
        </ClickToggle>
      ) : null}
      {subject ? (
        <DisplayOnPageYOffset yOffset={150}>
          <BreadcrumbBlock
            subject={subject}
            topicPath={topicPath}
            toTopic={toTopic}
          />
        </DisplayOnPageYOffset>
      ) : null}
    </MastheadItem>
    <MastheadItem right>
      <Logo to="/" altText="Nasjonal digital læringsarena" />
    </MastheadItem>
  </Masthead>
);

MastheadContainer.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      subjectId: PropTypes.string,
      topicId: PropTypes.string,
    }).isRequired,
  }).isRequired,
  t: PropTypes.func.isRequired,
  subject: SubjectShape,
  topics: PropTypes.arrayOf(TopicShape).isRequired,
  topicPath: PropTypes.arrayOf(TopicShape),
};

const mapStateToProps = (state, ownProps) => {
  const { subjectId, topicId } = ownProps.match.params;
  return {
    subject: getSubjectById(subjectId)(state),
    topics: getSubjectMenu(subjectId)(state),
    topicPath: getTopicPath(subjectId, topicId)(state),
  };
};

export default compose(injectT, connect(mapStateToProps))(MastheadContainer);
