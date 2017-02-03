/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes } from 'react';
import { Masthead, MastheadItem, SiteNav, SiteNavItem, Logo } from 'ndla-ui';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { toSearch } from '../../../routes';
import TopicMenu from './TopicMenu';
import { getTopicsBySubjectId, getSubjectById } from '../../SubjectPage/subjectSelectors';
import { SubjectShape } from '../../../shapes';
import ClickToggle from './ClickToggle';

const MastheadContainer = ({ t, subject, topics }) => (
  <Masthead>
    <MastheadItem left>
      <Logo to="/" altText="Nasjonal digital læringsarena" />
      { subject ?
        <ClickToggle title={subject.name} className="l-topic-menu-container" buttonClassName="c-topic-menu-toggle-button">
          <TopicMenu topics={topics} />
        </ClickToggle>
        : null
      }
    </MastheadItem>
    <MastheadItem right>
      <SiteNav>
        <SiteNavItem to={toSearch()}>
          {t('siteNav.search')}
        </SiteNavItem>
        <SiteNavItem to="#">
          {t('siteNav.contact')}
        </SiteNavItem>
        <SiteNavItem to="#">
          {t('siteNav.help')}
        </SiteNavItem>
      </SiteNav>
    </MastheadItem>
  </Masthead>
);

MastheadContainer.propTypes = {
  params: PropTypes.shape({
    subjectId: PropTypes.string,
    topicId: PropTypes.string,
  }).isRequired,
  t: PropTypes.func.isRequired,
  subject: SubjectShape,
  topics: PropTypes.array.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  const { subjectId } = ownProps.params;
  return {
    subject: getSubjectById(subjectId)(state),
    topics: getTopicsBySubjectId(subjectId)(state),
  };
};

export default compose(
  connect(mapStateToProps),
)(MastheadContainer);
