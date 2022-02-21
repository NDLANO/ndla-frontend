/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useContext, useEffect } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { MultidisciplinarySubject, NavigationBox } from '@ndla/ui';

import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { getUrnIdsFromProps, toTopic } from '../../routeHelpers';
import { useGraphQuery } from '../../util/runQueries';
import { subjectPageQuery } from '../../queries';
import DefaultErrorMessage from '../../components/DefaultErrorMessage';
import MultidisciplinaryTopicWrapper from './components/MultidisciplinaryTopicWrapper';
import {
  GQLSubjectPageQuery,
  GQLSubjectPageQueryVariables,
} from '../../graphqlTypes';
import SocialMediaMetadata from '../../components/SocialMediaMetadata';
import { AuthContext } from '../../components/AuthenticationContext';
import { htmlTitle } from '../../util/titleHelper';
import { RootComponentProps } from '../../routes';

interface Props extends RootComponentProps, RouteComponentProps {}

const MultidisciplinarySubjectPage = ({ match, locale }: Props) => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const { subjectId, topicList: selectedTopics } = getUrnIdsFromProps({
    ndlaFilm: false,
    match,
  });
  const refs = selectedTopics.map(_ => React.createRef<HTMLDivElement>());

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
    GQLSubjectPageQuery,
    GQLSubjectPageQueryVariables
  >(subjectPageQuery, {
    variables: {
      subjectId: subjectId!,
    },
  });

  if (loading) {
    return null;
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
              locale={locale}
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
  const subjectTitle = subject.name || subject.subjectpage?.about?.title;
  const hasSelectedTitle = !!selectedTitle;
  const title = htmlTitle(hasSelectedTitle ? selectedTitle : subjectTitle, [
    hasSelectedTitle ? subjectTitle : undefined,
  ]);

  const socialMediaMetaData = {
    title,
    description:
      selectedMetadata?.meta?.metaDescription ||
      selectedMetadata?.meta?.introduction ||
      subject.subjectpage?.about?.description ||
      subject.subjectpage?.metaDescription ||
      t('frontpageMultidisciplinarySubject.text'),
    image:
      selectedMetadata?.meta?.metaImage ||
      subject.subjectpage?.about?.visualElement,
  };

  const imageUrlObj = socialMediaMetaData.image?.url
    ? { url: socialMediaMetaData.image.url }
    : undefined;

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
        locale={locale}
        image={imageUrlObj}
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

export default withRouter(MultidisciplinarySubjectPage);
