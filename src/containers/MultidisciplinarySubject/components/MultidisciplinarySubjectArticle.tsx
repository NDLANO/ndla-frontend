/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from '@apollo/client';
import { useRef, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  ArticleSideBar,
  Breadcrumblist,
  FeideUserApiType,
  MultidisciplinarySubjectHeader,
  OneColumn,
} from '@ndla/ui';
import { withTracker } from '@ndla/tracker';
import { CustomWithTranslation, withTranslation } from 'react-i18next';
import { getAllDimensions } from '../../../util/trackingUtil';
import { htmlTitle } from '../../../util/titleHelper';
import Article from '../../../components/Article';
import Resources from '../../Resources/Resources';
import {
  GQLMultidisciplinarySubjectArticle_ResourceTypeDefinitionFragment,
  GQLMultidisciplinarySubjectArticle_SubjectFragment,
  GQLMultidisciplinarySubjectArticle_TopicFragment,
} from '../../../graphqlTypes';
import { transformArticle } from '../../../util/transformArticle';
import config from '../../../config';
import { getArticleScripts } from '../../../util/getArticleScripts';

const filterCodes: Record<string, 'publicHealth' | 'democracy' | 'climate'> = {
  TT1: 'publicHealth',
  TT2: 'democracy',
  TT3: 'climate',
};

interface Props extends CustomWithTranslation {
  topic: GQLMultidisciplinarySubjectArticle_TopicFragment;
  subject: GQLMultidisciplinarySubjectArticle_SubjectFragment;
  resourceTypes?: GQLMultidisciplinarySubjectArticle_ResourceTypeDefinitionFragment[];
  user?: FeideUserApiType;
  skipToContentId?: string;
}

const MultidisciplinarySubjectArticle = ({
  topic,
  subject,
  i18n,
  resourceTypes,
  skipToContentId,
}: Props) => {
  const resourcesRef = useRef(null);

  const [article, scripts] = useMemo(() => {
    if (!topic.article) return [undefined, undefined];
    return [
      transformArticle(topic.article, i18n.language, {
        enabled: true,
        path: `${config.ndlaFrontendDomain}/article/${topic.article.id}`,
        subject: subject.id,
      }),
      getArticleScripts(topic.article, i18n.language),
    ];
  }, [topic.article, i18n.language, subject.id]);

  if (!topic.article || !article) {
    return null;
  }

  const subjectLinks = topic.article.crossSubjectTopics?.map(
    (crossSubjectTopic) => ({
      label: crossSubjectTopic.title,
      url: crossSubjectTopic.path || subject.path || '',
    }),
  );
  const subjects = topic.article?.grepCodes
    ?.filter((grepCode) => grepCode.startsWith('TT'))
    .map((code) => filterCodes[code]!);

  return (
    <main>
      <Helmet>
        {scripts?.map((script) => (
          <script
            key={script.src}
            src={script.src}
            type={script.type}
            async={script.async}
            defer={script.defer}
          />
        ))}
      </Helmet>
      <Breadcrumblist hideOnNarrow items={[]} startOffset={268}>
        <ArticleSideBar />
      </Breadcrumblist>
      <MultidisciplinarySubjectHeader
        subjects={subjects}
        subjectsLinks={subjectLinks}
      />
      <OneColumn>
        <Article
          contentTransformed
          myNdlaResourceType="multidisciplinary"
          id={skipToContentId}
          article={article}
          label=""
          isTopicArticle={false}
          isResourceArticle={false}
          showFavoriteButton={config.feideEnabled}
          path={topic.path}
        />
        <div ref={resourcesRef}>
          <Resources
            topic={topic}
            resourceTypes={resourceTypes}
            headingType="h2"
            subHeadingType="h3"
          />
        </div>
      </OneColumn>
    </main>
  );
};

export const multidisciplinarySubjectArticleFragments = {
  topic: gql`
    fragment MultidisciplinarySubjectArticle_Topic on Topic {
      path
      article(showVisualElement: "true", convertEmbeds: $convertEmbeds) {
        created
        updated
        crossSubjectTopics(subjectId: $subjectId) {
          title
          path
        }
        ...Article_Article
      }
      ...Resources_Topic
    }
    ${Resources.fragments.topic}
    ${Article.fragments.article}
  `,
  subject: gql`
    fragment MultidisciplinarySubjectArticle_Subject on Subject {
      name
      id
      path
      allTopics {
        id
        name
      }
      subjectpage {
        about {
          title
        }
      }
    }
  `,
  resourceType: gql`
    fragment MultidisciplinarySubjectArticle_ResourceTypeDefinition on ResourceTypeDefinition {
      ...Resources_ResourceTypeDefinition
    }
    ${Resources.fragments.resourceType}
  `,
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
    .map((t) =>
      subject.allTopics?.find((topic) => topic.id.replace('urn:', '') === t),
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
