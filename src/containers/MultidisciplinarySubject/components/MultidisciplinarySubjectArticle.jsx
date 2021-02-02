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

const subjectPaths = {
  TT1:
    '/subject:d1fe9d0a-a54d-49db-a4c2-fd5463a7c9e7/topic:3cdf9349-4593-498c-a899-9310133a4788/',
  TT2:
    '/subject:d1fe9d0a-a54d-49db-a4c2-fd5463a7c9e7/topic:077a5e01-6bb8-4c0b-b1d4-94b683d91803/',
  TT3:
    '/subject:d1fe9d0a-a54d-49db-a4c2-fd5463a7c9e7/topic:a2f5aaa0-ab52-49d5-aabf-e7ffeac47fa2/',
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
    getSubjectsFromGrepCodes();
  }, []);

  const getSubjectsFromGrepCodes = async () => {
    const { grepCodes } = topic.article;
    const greps = await Promise.all(
      grepCodes
        .filter(code => code.startsWith('TT'))
        .map(async code => {
          const title = await fetchGrepCodeTitle(code, locale);
          return {
            label: title,
            url: subjectPaths[code],
            grepCode: code,
          };
        }),
    );
    setSubjectLinks(greps);
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
