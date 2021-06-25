/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useRef } from 'react';
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
import { htmlTitle } from '../../../util/titleHelper';
import { getSubjectLongName } from '../../../data/subjects';
import Article from '../../../components/Article';
import SocialMediaMetadata from '../../../components/SocialMediaMetadata';
import { scrollToRef } from '../../SubjectPage/subjectPageHelpers';
import Resources from '../../Resources/Resources';

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

  const subjectLinks = topic.article.crossSubjectTopics.map(
    crossSubjectTopic => ({
      label: crossSubjectTopic.title,
      url: crossSubjectTopic.path || subject.path,
    }),
  );
  const subjects = topic.article.grepCodes
    .filter(grepCode => grepCode.startsWith('TT'))
    .map(code => filterCodes[code]);

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
        title={htmlTitle(topic.article.title, [subject?.name])}
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
  return htmlTitle(topic.name || '', [t('htmlTitles.titleTemplate')]);
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

  const longName = getSubjectLongName(subject?.id, locale);

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
