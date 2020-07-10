/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { OneColumn, NavigationHeading, BreadCrumblist } from '@ndla/ui';
import { injectT } from '@ndla/i18n';
import { withTracker } from '@ndla/tracker';

import { LocationShape, FilterShape, TopicShape } from '../../shapes';
import SubjectPageSecondaryContent from './components/SubjectPageSecondaryContent';
import SubjectPageContent from './components/SubjectPageContent';
import SubjectEditorChoices from './components/SubjectEditorChoices';
import { getFiltersFromUrl } from '../../util/filterHelper';
import SocialMediaMetadata from '../../components/SocialMediaMetadata';
import { toTopic } from '../../routeHelpers';
import { scrollToRef } from './subjectPageHelpers';

const getDocumentTitle = ({ t, data }) => {
  return `${data?.subject?.name || ''}${t('htmlTitles.titleTemplate')}`;
};

const SubjectPage = ({
  location,
  history,
  locale,
  skipToContentId,
  t,
  subjectId,
  urlTopicId,
  urlSubTopicId,
  data,
}) => {
  const [topicId, setTopicId] = useState(urlTopicId);
  const [subTopicId, setSubTopicId] = useState(urlSubTopicId);
  const [topic, setTopic] = useState(null);
  const [subTopic, setSubTopic] = useState(null);
  const [currentLevel, setCurrentLevel] = useState('Subject');

  useEffect(() => {
    history.replace(toTopic(subjectId, filter?.id, topicId, subTopicId));
  }, [topic, subTopic]);

  const activeFilterId = getFiltersFromUrl(location);
  const { subject = {} } = data;
  const { name: subjectName } = subject;
  const subjectpage = subject.subjectpage || {};

  const {
    latestContent,
    editorsChoices,
    layout,
    about,
    metaDescription,
  } = subjectpage;

  const filter = subject.filters.find(filter => filter.id === activeFilterId);

  const breadCrumbs = [
    {
      id: subject.id,
      label: subject.name,
      typename: 'Subjecttype',
      url: '#',
    },
    ...(filter
      ? [
          {
            id: filter.id,
            label: filter.name,
            typename: 'Subject',
            url: '#',
            isCurrent: currentLevel === 'Subject',
          },
        ]
      : []),
    ...(topic ? [{ ...topic, isCurrent: currentLevel === 'Topic' }] : []),
    ...(subTopic
      ? [{ ...subTopic, isCurrent: currentLevel === 'Subtopic' }]
      : []),
  ];

  const setTopicBreadCrumb = topic => {
    setCurrentLevel('Topic');
    setTopicId(topic.id);
    setTopic(
      topic
        ? {
            ...topic,
            typename: 'Topic',
            url: '#',
          }
        : null,
    );
  };

  const setSubTopicBreadCrumb = topic => {
    setCurrentLevel('Subtopic');
    setSubTopicId(topic.id);
    setSubTopic(
      topic
        ? {
            ...topic,
            typename: 'Subtopic',
            url: '#',
          }
        : null,
    );
  };

  const headerRef = useRef(null);
  const mainRef = useRef(null);
  const subRef = useRef(null);

  const handleNav = (e, item) => {
    e.preventDefault();
    const { typename } = item;
    setCurrentLevel(typename);
    if (typename === 'Subjecttype') {
      scrollToRef(headerRef);
    } else if (typename === 'Topic') {
      scrollToRef(mainRef);
    } else if (typename === 'Subtopic') {
      scrollToRef(subRef);
    }
  };

  return (
    <>
      <Helmet>
        <title>{`${getDocumentTitle({ t, data })}`}</title>
        {metaDescription && (
          <meta name="description" content={metaDescription} />
        )}
      </Helmet>
      <OneColumn>
        {about && (
          <SocialMediaMetadata
            title={about.title}
            description={metaDescription}
            locale={locale}
            image={
              about.visualElement && {
                src: about.visualElement.url,
                altText: about.visualElement.alt,
              }
            }
          />
        )}
        <BreadCrumblist items={breadCrumbs} onNav={handleNav} />
        <div ref={headerRef}>
          <NavigationHeading subHeading={subjectName}>
            {filter?.name}
          </NavigationHeading>
        </div>
        <SubjectPageContent
          skipToContentId={skipToContentId}
          layout={layout}
          locale={locale}
          subjectId={subjectId}
          subjectpage={subjectpage}
          subject={subject}
          filter={filter}
          topicId={topicId}
          setTopicId={setTopicId}
          subTopicId={subTopicId}
          setSubTopicId={setSubTopicId}
          setSelectedTopic={setTopicBreadCrumb}
          setSubTopic={setSubTopic}
          setSelectedSubTopic={setSubTopicBreadCrumb}
          mainRef={mainRef}
          subRef={subRef}
        />
        <SubjectEditorChoices
          wideScreen
          editorsChoices={editorsChoices}
          locale={locale}
        />
        {latestContent && (
          <SubjectPageSecondaryContent
            locale={locale}
            subjectName={subjectName}
            latestContent={latestContent}
          />
        )}
      </OneColumn>
    </>
  );
};

SubjectPage.getDocumentTitle = getDocumentTitle;

SubjectPage.willTrackPageView = (trackPageView, currentProps) => {
  const { data } = currentProps;
  if (data?.subject?.topics?.length > 0) {
    trackPageView(currentProps);
  }
};

SubjectPage.propTypes = {
  history: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
  location: LocationShape,
  match: PropTypes.shape({
    params: PropTypes.shape({
      subjectId: PropTypes.string.isRequired,
      topicId: PropTypes.string,
    }).isRequired,
  }).isRequired,
  locale: PropTypes.string.isRequired,
  ndlaFilm: PropTypes.bool,
  skipToContentId: PropTypes.string.isRequired,
  subjectId: PropTypes.string.isRequired,
  data: PropTypes.shape({
    subject: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      path: PropTypes.string,
      filters: PropTypes.arrayOf(FilterShape),
      topics: PropTypes.arrayOf(TopicShape),
    }),
  }),
  urlTopicId: PropTypes.string,
  urlSubTopicId: PropTypes.string,
};

export default injectT(withTracker(SubjectPage));
