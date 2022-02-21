/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useRef } from 'react';
import {
  ArticleSideBar,
  Breadcrumblist,
  MultidisciplinarySubjectHeader,
  OneColumn,
} from '@ndla/ui';
import { withTracker } from '@ndla/tracker';

import { WithTranslation, withTranslation } from 'react-i18next';
import { getAllDimensions } from '../../../util/trackingUtil';
import { htmlTitle } from '../../../util/titleHelper';
import Article from '../../../components/Article';
import { scrollToRef } from '../../SubjectPage/subjectPageHelpers';
import Resources from '../../Resources/Resources';
import {
  GQLResourceTypeDefinition,
  GQLTopicWithPathTopicsQuery,
} from '../../../graphqlTypes';
import { LocaleType } from '../../../interfaces';
import { FeideUserWithGroups } from '../../../util/feideApi';

const filterCodes: Record<string, 'publicHealth' | 'democracy' | 'climate'> = {
  TT1: 'publicHealth',
  TT2: 'democracy',
  TT3: 'climate',
};

interface Props extends WithTranslation {
  copyPageUrlLink?: string;
  topic: Required<GQLTopicWithPathTopicsQuery>['topic'];
  subject: Required<GQLTopicWithPathTopicsQuery>['subject'];
  locale: LocaleType;
  resourceTypes?: GQLResourceTypeDefinition[];
  user?: FeideUserWithGroups;
  skipToContentId?: string;
}

const MultidisciplinarySubjectArticle = ({
  copyPageUrlLink,
  topic,
  subject,
  locale,
  resourceTypes,
  skipToContentId,
}: Props) => {
  const resourcesRef = useRef(null);
  const onLinkToResourcesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToRef(resourcesRef, 0);
  };

  if (!topic.article) {
    return null;
  }

  const subjectLinks = topic.article.crossSubjectTopics?.map(
    crossSubjectTopic => ({
      label: crossSubjectTopic.title,
      url: crossSubjectTopic.path || subject.path || '',
    }),
  );
  const subjects = topic.article?.grepCodes
    ?.filter(grepCode => grepCode.startsWith('TT'))
    .map(code => filterCodes[code]!);

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
      <OneColumn>
        <Article
          id={skipToContentId}
          article={topic.article}
          label=""
          locale={locale}
          isTopicArticle={false}
          isResourceArticle={false}
        />
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

MultidisciplinarySubjectArticle.getDocumentTitle = ({ t, topic }: Props) => {
  return htmlTitle(topic.name || '', [t('htmlTitles.titleTemplate')]);
};

MultidisciplinarySubjectArticle.willTrackPageView = (
  trackPageView: (item: Props) => void,
  currentProps: Props,
) => {
  const { topic } = currentProps;
  if (topic?.article) {
    trackPageView(currentProps);
  }
};

MultidisciplinarySubjectArticle.getDimensions = (props: Props) => {
  const { topic, subject, user } = props;
  const topicPath = topic.path
    ?.split('/')
    .slice(2)
    .map(t =>
      subject.allTopics?.find(topic => topic.id.replace('urn:', '') === t),
    );

  return getAllDimensions(
    {
      subject,
      topicPath,
      article: topic?.article,
      filter: subject.name,
      user,
    },
    undefined,
    true,
  );
};

export default withTranslation()(withTracker(MultidisciplinarySubjectArticle));
