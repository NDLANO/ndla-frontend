/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { MultidisciplinarySubject, NavigationBox } from '@ndla/ui';

import { getUrnIdsFromProps, toTopic } from '../../routeHelpers';
import { useGraphQuery } from '../../util/runQueries';
import { subjectPageQuery } from '../../queries';
import { LocationShape } from '../../shapes';
import DefaultErrorMessage from '../../components/DefaultErrorMessage';
import MultidisciplinaryTopicWrapper from './components/MultidisciplinaryTopicWrapper';

const MultidisciplinarySubjectPage = ({ match, history, location, locale }) => {
  const { subjectId, topicList: selectedTopics } = getUrnIdsFromProps({
    ndlaFilm: false,
    match,
  });
  const refs = selectedTopics.map(_ => React.createRef());

  useEffect(() => {
    if (selectedTopics.length) {
      const ref = refs[selectedTopics.length - 1];
      const positionFromTop =
        ref.current?.getBoundingClientRect().top +
        document.documentElement.scrollTop;
      window.scrollTo({
        top: positionFromTop - 100,
        behavior: 'smooth',
      });
    }
  }, [selectedTopics]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const { subject = {} } = data;

  const mainTopics = subject.topics?.map(topic => {
    return {
      ...topic,
      label: topic.name,
      selected: topic.id === selectedTopics[0],
      url: toTopic(subject.id, topic.id),
    };
  });

  const selectionLimit = 2;
  const isNotLastTopic = selectedTopics.length < selectionLimit;
  const selectedSubject =
    isNotLastTopic || subject.topics?.find(t => t.id === selectedTopics[0]);

  const cards = isNotLastTopic
    ? []
    : subject.allTopics
        .filter(topic => {
          const selectedId = selectedTopics[selectedTopics.length - 1];
          return topic.parent === selectedId;
        })
        .map(topic => ({
          title: topic.name,
          topicId: topic.id,
          introduction: topic.meta.metaDescription,
          image: topic.meta.metaImage?.url,
          imageAlt: topic.meta.metaImage?.alt,
          subjects: [selectedSubject.name],
          url: topic.path,
          ...topic,
        }));

  const TopicBoxes = () =>
    selectedTopics.map((topicId, index) => {
      return (
        <div key={index} ref={refs[index]}>
          <MultidisciplinaryTopicWrapper
            disableNav={index >= selectionLimit - 1}
            topicId={topicId}
            subjectId={subject.id}
            subTopicId={selectedTopics[index + 1]}
            locale={locale}
            index={index}
            subject={subject}
          />
        </div>
      );
    });

  return (
    <MultidisciplinarySubject
      hideCards={isNotLastTopic}
      cards={cards}
      totalCardCount={cards.length}>
      <NavigationBox items={mainTopics} listDirection="horizontal" />
      <TopicBoxes />
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
