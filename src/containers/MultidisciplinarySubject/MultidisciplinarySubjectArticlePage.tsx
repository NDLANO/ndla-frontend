/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { RouteComponentProps } from 'react-router';
import Spinner from '@ndla/ui/lib/Spinner';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { useGraphQuery } from '../../util/runQueries';
import { topicQueryWithPathTopics } from '../../queries';
import { getUrnIdsFromProps } from '../../routeHelpers';
import MultidisciplinarySubjectArticle from './components/MultidisciplinarySubjectArticle';
import config from '../../config';
import { LocaleType } from '../../interfaces';
import {
  GQLTopicWithPathTopicsQuery,
  GQLTopicWithPathTopicsQueryVariables,
} from '../../graphqlTypes';
import DefaultErrorMessage from '../../components/DefaultErrorMessage';
import { htmlTitle } from '../../util/titleHelper';
import SocialMediaMetadata from '../../components/SocialMediaMetadata';

interface Props extends RouteComponentProps {
  locale: LocaleType;
}

const MultidisciplinarySubjectArticlePage = ({ match, locale }: Props) => {
  const { t } = useTranslation();
  const { topicId, subjectId } = getUrnIdsFromProps({ match });

  const { data, loading } = useGraphQuery<
    GQLTopicWithPathTopicsQuery,
    GQLTopicWithPathTopicsQueryVariables
  >(topicQueryWithPathTopics, {
    variables: {
      topicId: topicId!,
      subjectId: subjectId!,
      showVisualElement: 'true',
    },
  });

  if (loading) {
    return <Spinner />;
  }

  if (!data?.topic || !data?.subject) {
    return <DefaultErrorMessage />;
  }

  const { topic, subject, resourceTypes } = data;
  const copyPageUrlLink = topic?.path && config.ndlaFrontendDomain + topic.path;

  const socialMediaMetaData = {
    title: htmlTitle(topic.name ?? topic.article?.title, [subject.name]),
    description: topic.article?.metaDescription ?? topic.article?.introduction,
    image: topic.article?.metaImage,
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
        locale={locale}
        image={
          socialMediaMetaData.image && {
            url: socialMediaMetaData.image.url,
            alt: socialMediaMetaData.image.alt,
          }
        }
        trackableContent={{
          supportedLanguages: topic.article?.supportedLanguages,
          tags: topic.article?.tags,
        }}
      />
      <MultidisciplinarySubjectArticle
        topic={topic}
        subject={subject}
        resourceTypes={resourceTypes}
        copyPageUrlLink={copyPageUrlLink}
        locale={locale}
      />
    </>
  );
};

export default MultidisciplinarySubjectArticlePage;
