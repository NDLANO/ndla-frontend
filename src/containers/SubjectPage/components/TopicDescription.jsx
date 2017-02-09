/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import BEMHelper from 'react-bem-helper';
import { injectT } from '../../../i18n';
import { toTopic } from '../../../routes';

const classes = new BEMHelper({
  name: 'topic-description',
  prefix: 'c-',
});

const TopicDescription = ({ topic, subjectId, t }) => (
  <section {...classes()}>
    <h1 {...classes('header')}>{topic.name}</h1>
    <Link {...classes('topic-link', '', 'c-button c-button--outline')} to={toTopic(subjectId, topic.id)}>{t('subject.associatedTopics')}</Link>
  </section>
);

TopicDescription.propTypes = {
  topic: PropTypes.object.isRequired,
  subjectId: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(TopicDescription);
