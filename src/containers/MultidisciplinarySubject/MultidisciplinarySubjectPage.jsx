/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { MultidisciplinarySubject, NavigationBox } from '@ndla/ui';

import queryString from 'query-string';
import { getUrnIdsFromProps, toTopic } from '../../routeHelpers';
import { useGraphQuery } from '../../util/runQueries';
import { subjectPageQuery } from '../../queries';
import { LocationShape } from '../../shapes';
import { DefaultErrorMessage } from '../../components/DefaultErrorMessage';
import MultidisciplinaryTopicWrapper from './components/MultidisciplinaryTopicWrapper';

const MultidisciplinarySubjectPage = ({ match, history, location, locale }) => {
  const { topicList: selectedTopics } = getUrnIdsFromProps({
    ndlaFilm: false,
    match,
  });

  const subjectId = `urn:${match.path.split('/')[1]}`;

  const { loading, data } = useGraphQuery(subjectPageQuery, {
    variables: {
      subjectId,
    },
  });

  if (loading) {
    return null;
  }

  if (!data) {
    return <DefaultErrorMessage />;
  }

  const onClickTopics = () => {};

  const items = [];
  const { subject = {} } = data;

  console.log('sub', subject);

  const mainTopics = subject.topics.map(topic => {
    return {
      ...topic,
      label: topic.name,
      selected: topic.id === selectedTopics[0],
      url: toTopic(subject.id, [], topic.id),
    };
  });

  return (
    <MultidisciplinarySubject cards={items} totalCardCount={0}>
      <NavigationBox
        items={mainTopics}
        listDirection="horizontal"
        onClick={e => {
          onClickTopics(e);
        }}
      />
      {selectedTopics.map((topicId, index) => {
        return (
          <div key={index}>
            <MultidisciplinaryTopicWrapper
              disableNav={index >= 1}
              setBreadCrumb={() => {}}
              topicId={topicId}
              subjectId={subject.id}
              subTopicId={selectedTopics[index + 1]}
              locale={locale}
              onClickTopics={onClickTopics}
              index={index}
              showResources={false}
              subject={subject}
            />
          </div>
        );
      })}
    </MultidisciplinarySubject>
  );
};

MultidisciplinarySubjectPage.propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: LocationShape,
  locale: PropTypes.string.isRequired,
};

export default MultidisciplinarySubjectPage;
