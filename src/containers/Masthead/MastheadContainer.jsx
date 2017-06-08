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
  Masthead,
  MastheadItem,
  SiteNav,
  SiteNavItem,
  Logo,
  ClickToggle,
  TopicMenu,
} from 'ndla-ui';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { toSearch, toTopic } from '../../routes';
import { getSubjectById } from '../SubjectPage/subjectSelectors';
import { getSubjectMenu } from '../TopicPage/topicSelectors';
import { SubjectShape, TopicShape } from '../../shapes';

function toTopicWithSubjectIdBound(subjectId) {
  return toTopic.bind(undefined, subjectId);
}

const MastheadContainer = ({ t, subject, searchEnabled, topics }) => (
  <Masthead>
    <MastheadItem left>
      {subject
        ? <ClickToggle
            title={subject.name}
            className="c-topic-menu-container"
            buttonClassName="c-topic-menu-toggle-button">
            <TopicMenu
              subjectId={subject.id}
              toTopic={toTopicWithSubjectIdBound(subject.id)}
              topics={topics}
            />
          </ClickToggle>
        : null}
      {searchEnabled
        ? <SiteNav>
            <SiteNavItem to={toSearch()}>
              {t('siteNav.search')}
            </SiteNavItem>
          </SiteNav>
        : null}
    </MastheadItem>
    <MastheadItem right>
      <Logo to="/" altText="Nasjonal digital læringsarena" />
    </MastheadItem>
  </Masthead>
);

MastheadContainer.propTypes = {
  searchEnabled: PropTypes.bool.isRequired,
  params: PropTypes.shape({
    subjectId: PropTypes.string,
    topicId: PropTypes.string,
  }).isRequired,
  t: PropTypes.func.isRequired,
  subject: SubjectShape,
  topics: PropTypes.arrayOf(TopicShape).isRequired,
};

const mapStateToProps = (state, ownProps) => {
  const { subjectId } = ownProps.params;
  return {
    subject: getSubjectById(subjectId)(state),
    topics: getSubjectMenu(subjectId)(state),
  };
};

export default compose(connect(mapStateToProps))(MastheadContainer);
