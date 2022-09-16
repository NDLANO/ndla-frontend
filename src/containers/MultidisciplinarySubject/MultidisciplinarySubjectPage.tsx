/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from '@apollo/client';
import { createRef, useContext, useEffect } from 'react';
import {
  ContentPlaceholder,
  MultidisciplinarySubject,
  NavigationBox,
} from '@ndla/ui';

import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { toTopic, useUrnIds } from '../../routeHelpers';
import { useGraphQuery } from '../../util/runQueries';
import DefaultErrorMessage from '../../components/DefaultErrorMessage';
import MultidisciplinaryTopicWrapper from './components/MultidisciplinaryTopicWrapper';
import {
  GQLMultidisciplinarySubjectPageQuery,
  GQLMultidisciplinarySubjectPageQueryVariables,
} from '../../graphqlTypes';
import SocialMediaMetadata from '../../components/SocialMediaMetadata';
import { AuthContext } from '../../components/AuthenticationContext';
import { htmlTitle } from '../../util/titleHelper';

const multidisciplinarySubjectPageQuery = gql`
  query multidisciplinarySubjectPage($subjectId: String!) {
    subject(id: $subjectId) {
      subjectpage {
        about {
          title
        }
      }
      topics {
        id
        name
      }
      allTopics {
        name
        id
        parent
        path
        meta {
          title
          introduction
          metaDescription
          metaImage {
            url
            alt
          }
        }
      }
      ...MultidisciplinaryTopicWrapper_Subject
    }
  }
  ${MultidisciplinaryTopicWrapper.fragments.subject}
`;

const MultidisciplinarySubjectPage = () => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const { subjectId, topicList: selectedTopics } = useUrnIds();
  const refs = selectedTopics.map(_ => createRef<HTMLDivElement>());

  useEffect(() => {
    if (selectedTopics.length) {
      const ref = refs[selectedTopics.length - 1];
      const positionFromTop =
        (ref?.current?.getBoundingClientRect().top ?? 0) +
        document.documentElement.scrollTop;
      window.scrollTo({
        top: positionFromTop - 100,
        behavior: 'smooth',
      });
    }
  }, [refs, selectedTopics]);

  const { loading, data } = useGraphQuery<
    GQLMultidisciplinarySubjectPageQuery,
    GQLMultidisciplinarySubjectPageQueryVariables
  >(multidisciplinarySubjectPageQuery, {
    variables: {
      subjectId: subjectId!,
    },
  });

  if (loading) {
    return <ContentPlaceholder />;
  }

  if (!data?.subject) {
    return <DefaultErrorMessage />;
  }

  const { subject } = data;

  const mainTopics =
    subject.topics?.map(topic => {
      return {
        ...topic,
        label: topic.name,
        selected: topic.id === selectedTopics[0],
        url: toTopic(subject.id, topic.id),
      };
    }) ?? [];

  const selectionLimit = 2;
  const isNotLastTopic = selectedTopics.length < selectionLimit;
  const selectedSubject = subject.topics?.find(
    t => t.id === selectedTopics[0],
  )!;

  const cards = isNotLastTopic
    ? []
    : subject.allTopics
        ?.filter(topic => {
          const selectedId = selectedTopics[selectedTopics.length - 1];
          return topic.parent === selectedId;
        })
        .map(topic => ({
          title: topic.name,
          topicId: topic.id,
          introduction: topic.meta?.metaDescription ?? '',
          image: topic.meta?.metaImage?.url,
          imageAlt: topic.meta?.metaImage?.alt,
          subjects: isNotLastTopic ? undefined : [selectedSubject?.name],
          url: topic.path ?? '',
          ...topic,
        })) || [];

  const TopicBoxes = () => (
    <>
      {selectedTopics.map((topicId, index) => {
        return (
          <div key={index} ref={refs[index]}>
            <MultidisciplinaryTopicWrapper
              disableNav={index >= selectionLimit - 1}
              topicId={topicId}
              subjectId={subject.id}
              subTopicId={selectedTopics[index + 1]}
              subject={subject}
              user={user}
            />
          </div>
        );
      })}
    </>
  );

  const selectedMetadata = [...(subject.allTopics ?? [])]
    .reverse()
    .find(t => selectedTopics.includes(t.id));

  const selectedTitle = selectedMetadata?.name || selectedMetadata?.meta?.title;
  const subjectTitle = subject.subjectpage?.about?.title || subject.name;
  const hasSelectedTitle = !!selectedTitle;
  const title = htmlTitle(hasSelectedTitle ? selectedTitle : subjectTitle, [
    hasSelectedTitle ? subjectTitle : undefined,
  ]);

  const socialMediaMetaData = {
    title,
    description:
      selectedMetadata?.meta?.metaDescription ||
      selectedMetadata?.meta?.introduction ||
      t('frontpageMultidisciplinarySubject.text'),
    image: selectedMetadata?.meta?.metaImage,
  };

  return (
    <>
      <Helmet>
        <title>
          {htmlTitle(socialMediaMetaData.title, [
            t('htmlTitles.titleTemplate'),
          ])}
        </title>
        {socialMediaMetaData.description && (
          <meta name="description" content={socialMediaMetaData.description} />
        )}
      </Helmet>
      <SocialMediaMetadata
        title={socialMediaMetaData.title}
        description={socialMediaMetaData.description}
        imageUrl={socialMediaMetaData.image?.url}
      />
      <MultidisciplinarySubject
        hideCards={isNotLastTopic}
        cards={cards}
        totalCardCount={cards.length}>
        <NavigationBox items={mainTopics} listDirection="horizontal" />
        <TopicBoxes />
      </MultidisciplinarySubject>
    </>
  );
};

export default MultidisciplinarySubjectPage;
