/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  ArticleSideBar,
  Breadcrumblist,
  MultidisciplinarySubjectHeader,
  OneColumn,
} from '@ndla/ui';
import { injectT } from '@ndla/i18n';
import { withTracker } from '@ndla/tracker';
import { ArticleShape, SubjectShape } from '@ndla/ui/lib/shapes';

import { getAllDimensions } from '../../../util/trackingUtil';
import { getSubjectBySubjectIdFilters } from '../../../data/subjects';
import Article from '../../../components/Article';
import SocialMediaMetadata from '../../../components/SocialMediaMetadata';
import { scrollToRef } from '../../SubjectPage/subjectPageHelpers';
import Resources from '../../Resources/Resources';
import { fetchGrepCodeTitle } from '../../../util/grepApi';

const filterCodes = {
  TT1: 'publicHealth',
  TT2: 'democracy',
  TT3: 'climate',
};

const MultidisciplinarySubjectArticle = ({
  copyPageUrlLink,
  topic,
  subject,
  locale,
  resourceTypes,
}) => {
  const resourcesRef = useRef(null);
  const onLinkToResourcesClick = e => {
    e.preventDefault();
    scrollToRef(resourcesRef, 0);
  };
  const [subjectLinks, setSubjectLinks] = useState([]);

  useEffect(() => {
    getSubjectsFromGrepCodes().then(subjects => setSubjectLinks(subjects));
  }, []);

  const getSubjectsFromGrepCodes = async () => {
    const { grepCodes } = topic.article;
    return await Promise.all(
      grepCodes
        .filter(code => code.startsWith('TT'))
        .map(async code => {
          const title = await fetchGrepCodeTitle(code, locale);
          const subjectInfo = subject.topics.find(({ name }) => name === title);
          return {
            label: title,
            url: subjectInfo ? subjectInfo.path : subject.path,
            grepCode: code,
          };
        }),
    );
  };

  // "Base topics" are considered subjects
  const subjects = subjectLinks.map(codes => filterCodes[codes.grepCode]);

  return (
    <>
      <Breadcrumblist hideOnNarrow items={[]} startOffset={268}>
        <ArticleSideBar
          copyPageUrlLink={copyPageUrlLink}
          onLinkToResourcesClick={onLinkToResourcesClick}
          linkToResources="#"
        />
      </Breadcrumblist>
      <MultidisciplinarySubjectHeader
        subjects={subjects}
        subjectsLinks={subjectLinks}
      />
      <SocialMediaMetadata
        title={`${subject?.name ? subject.name + ' - ' : ''}${
          topic.article.title
        }`}
        trackableContent={topic.article}
        description={topic.article.metaDescription}
        locale={locale}
        image={topic.article.metaImage}
      />
      <OneColumn>
        <Article article={topic.article} label="" locale={locale} />
        <div ref={resourcesRef}>
          <Resources
            topic={topic}
            resourceTypes={resourceTypes}
            locale={locale}
          />
        </div>
      </OneColumn>
    </>
  );
};

MultidisciplinarySubjectArticle.propTypes = {
  copyPageUrlLink: PropTypes.string,
  topic: PropTypes.shape({
    article: ArticleShape,
    pathTopics: PropTypes.array,
  }).isRequired,
  subject: SubjectShape.isRequired,
  locale: PropTypes.string,
  resourceTypes: PropTypes.array,
};

MultidisciplinarySubjectArticle.getDocumentTitle = ({ t, topic }) => {
  return `${topic.name || ''}${t('htmlTitles.titleTemplate')}`;
};

MultidisciplinarySubjectArticle.willTrackPageView = (
  trackPageView,
  currentProps,
) => {
  const { topic } = currentProps;
  if (topic.article) {
    trackPageView(currentProps);
  }
};

MultidisciplinarySubjectArticle.getDimensions = props => {
  const { topic, locale, subject } = props;
  const topicPath = topic.path
    .split('/')
    .slice(2)
    .map(t =>
      subject.allTopics.find(topic => topic.id.replace('urn:', '') === t),
    );

  const subjectBySubjectIdFiltes = getSubjectBySubjectIdFilters(subject.id, []);
  const longName = subjectBySubjectIdFiltes?.longName[locale];

  return getAllDimensions(
    {
      subject: subject,
      topicPath,
      article: topic.article,
      filter: longName,
    },
    undefined,
    true,
  );
};

export default injectT(withTracker(MultidisciplinarySubjectArticle));
