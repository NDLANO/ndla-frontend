/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
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
import config from '../../config';

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
  data,
}) => {
  const [topic, setTopic] = useState(null);
  const [subTopic, setSubTopic] = useState(null);
  const [currentLevel, setCurrentLevel] = useState('Subject');

  const handleFilterClick = newValues => {
    const searchString = `?${queryString.stringify({
      filters: newValues.join(','),
    })}`;
    history.push(
      newValues.length > 0
        ? {
            search: searchString,
          }
        : {},
    );
  };

  const activeFilterId = getFiltersFromUrl(location);
  const { subject = {} } = data;
  const { name: subjectName } = subject;
  const subjectpage = subject.subjectpage || {};

  const {
    latestContent,
    facebook,
    banner,
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
    {
      id: filter.id,
      label: filter.name,
      typename: 'Subject',
      url: '#',
      isCurrent: currentLevel === 'Subject',
    },
    ...(topic ? [{ ...topic, isCurrent: currentLevel === 'Topic' }] : []),
    ...(subTopic ? [{...subTopic, isCurrent: currentLevel === 'Subtopic' }] : []),
  ];

  const setTopicBreadCrumb = topic => {
    setCurrentLevel('Topic');
    setTopic(
      topic
        ? {
            ...topic,
            typename: 'Topic',
            url: '#',
          }
        : null,
    );
    setSubTopic(null);
  };

  const setSubTopicBreadCrumb = topic => {
    setCurrentLevel('Subtopic');
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

  const handleNav = (e, item) => {
    e.preventDefault();
    const { typename } = item;
    setCurrentLevel(typename);
  }

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
        <NavigationHeading subHeading={subjectName}>
          {filter?.name}
        </NavigationHeading>
        <SubjectPageContent
          skipToContentId={skipToContentId}
          layout={layout}
          locale={locale}
          subjectId={subjectId}
          subjectpage={subjectpage}
          subject={subject}
          handleFilterClick={handleFilterClick}
          filter={filter}
          selectedTopic={topic}
          selectedSubTopic={subTopic}
          setSelectedTopic={setTopicBreadCrumb}
          setSelectedSubTopic={setSubTopicBreadCrumb}
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
    push: PropTypes.func.isRequired,
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
};

export default injectT(withTracker(SubjectPage));
