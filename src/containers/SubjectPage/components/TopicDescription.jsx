/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { injectT } from '../../../i18n';
import { toTopic } from '../../../routes';

const TopicDescription = ({ topic, subjectId, t }) => (
  <section className="c-topic-desctiption">
    <h5 className="c-topic-card__header">{topic.name}</h5>
    <Link to={toTopic(subjectId, topic.id)}>{t('subject.associatedTopics')}</Link>
  </section>
);

TopicDescription.propTypes = {
  topic: PropTypes.object.isRequired,
  subjectId: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(TopicDescription);
