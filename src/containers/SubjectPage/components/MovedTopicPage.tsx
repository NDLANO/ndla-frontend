/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// @ts-ignore
import { SearchResultList, OneColumn } from '@ndla/ui';
import { useTranslation } from 'react-i18next';
import { resultsWithContentTypeBadgeAndImage } from '../../SearchPage/searchHelpers';
import { GQLSearchResult, GQLTopic } from '../../../graphqlTypes';

interface GQLSearchResultExtended
  extends Omit<
    GQLSearchResult,
    'id' | 'contexts' | 'metaDescription' | 'supportedLanguages' | 'traits'
  > {
  subjects?: {
    url?: string;
    title: string;
    breadcrumb: string[];
  }[];
  ingress?: string;
  id: string;
  contentType: string;
}

const convertTopicToResult = (
  topic: Omit<GQLTopic, 'metadata' | 'paths'>,
): GQLSearchResultExtended => {
  return {
    metaImage: topic.meta?.metaImage,
    title: topic.name,
    url: topic.path || '',
    id: topic.id,
    ingress: topic.meta?.metaDescription,
    subjects: topic.breadcrumbs?.map(crumb => ({
      url: topic.path,
      title: crumb?.[0]!,
      breadcrumb: crumb,
    })),
    contentType: 'topic',
  };
};

const mergeTopicSubjects = (results: GQLSearchResultExtended[]) => {
  // Assuming that first element has the same values that the rest of the elements in the results array
  return [
    {
      ...results[0],
      subjects: results.flatMap(
        (topic: GQLSearchResultExtended) => topic.subjects,
      ),
    },
  ];
};

interface Props {
  topics: Omit<GQLTopic, 'metadata' | 'paths'>[];
}

const MovedTopicPage = ({ topics }: Props) => {
  const { t } = useTranslation();
  const topicsAsResults = topics.map(convertTopicToResult);
  const results = resultsWithContentTypeBadgeAndImage(topicsAsResults, t);
  const mergedTopic = mergeTopicSubjects(results);

  return (
    <OneColumn>
      <h1>{t('movedResourcePage.title')}</h1>
      <div className="c-search-result">
        <SearchResultList results={mergedTopic} />
      </div>
    </OneColumn>
  );
};

export default MovedTopicPage;
