/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { gql } from '@apollo/client';
import styled from '@emotion/styled';
import { breakpoints, colors, mq, spacing } from '@ndla/core';
import { SearchResultList, OneColumn } from '@ndla/ui';
import {
  GQLMovedTopicPage_TopicFragment,
  GQLSearchResult,
} from '../../../graphqlTypes';
import { resultsWithContentTypeBadgeAndImage } from '../../SearchPage/searchHelpers';

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
  ingress: string;
  id: string;
  contentType: string;
}

const convertTopicToResult = (
  topic: GQLMovedTopicPage_TopicFragment,
): GQLSearchResultExtended => {
  return {
    metaImage: topic.meta?.metaImage,
    title: topic.name,
    url: topic.path || '',
    id: topic.id,
    ingress: topic.meta?.metaDescription ?? '',
    subjects: topic.contexts?.map(({ breadcrumbs }) => ({
      url: topic.path,
      title: breadcrumbs[0]!,
      breadcrumb: breadcrumbs,
    })),
    contentType: 'topic',
  };
};

const mergeTopicSubjects = (results: GQLSearchResultExtended[]) => {
  // Must have at least one result in order to get here.
  const firstResult = results[0]!;
  // Assuming that first element has the same values that the rest of the elements in the results array
  return [
    {
      ...firstResult,
      subjects: results.flatMap(
        (topic: GQLSearchResultExtended) => topic.subjects ?? [],
      ),
    },
  ];
};

interface Props {
  topics: GQLMovedTopicPage_TopicFragment[];
}

const StyledSearchResultListWrapper = styled.div`
  padding-bottom: ${spacing.medium};
  margin-bottom: ${spacing.large};
  border: 1px solid ${colors.brand.greyLight};
  ${mq.range({ from: breakpoints.desktop })} {
    padding: ${spacing.medium};
  }
`;

const MovedTopicPage = ({ topics }: Props) => {
  const { t } = useTranslation();
  const topicsAsResults = topics.map(convertTopicToResult);
  const results = resultsWithContentTypeBadgeAndImage(topicsAsResults, t);
  const mergedTopic = mergeTopicSubjects(results);

  return (
    <OneColumn>
      <h1>{t('movedResourcePage.title')}</h1>
      <StyledSearchResultListWrapper>
        <SearchResultList results={mergedTopic} />
      </StyledSearchResultListWrapper>
    </OneColumn>
  );
};

MovedTopicPage.fragments = {
  topic: gql`
    fragment MovedTopicPage_Topic on Topic {
      id
      path
      name
      meta {
        metaDescription
        metaImage {
          url
          alt
        }
      }
      contexts {
        breadcrumbs
      }
    }
  `,
};

export default MovedTopicPage;
