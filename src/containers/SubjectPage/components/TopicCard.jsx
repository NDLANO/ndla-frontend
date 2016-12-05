/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import isEmpty from 'lodash/isEmpty';
import { injectT } from '../../../i18n';
import { toTopic } from '../../../routes';

const TopicCard = ({ topic, subjectId, t }) => (
  <section className="c-topic-card">
    <h1 className="c-topic-card__header">{topic.name}</h1>
    <p className="c-topic-card__body">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
      Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </p>
    { !isEmpty(topic.subtopics) ? <Link to={toTopic(subjectId, topic.id)}>{t('subject.associatedTopics')}</Link> : null }
  </section>
);

TopicCard.propTypes = {
  topic: PropTypes.object.isRequired,
  subjectId: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(TopicCard);
