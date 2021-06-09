/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { injectT, tType } from '@ndla/i18n';
// @ts-ignore
import { SearchResultList, OneColumn } from '@ndla/ui';
// @ts-ignore
import {
  resultsWithContentTypeBadgeAndImage,
  mergeTopicSubjects,
} from '../../SearchPage/searchHelpers';
import { GQLTopic } from '../../../graphqlTypes';

const convertTopicToResult = (topic: GQLTopic) => {
  return {
    metaImage: topic.meta?.metaImage,
    title: topic.name,
    url: topic.path,
    id: topic.id,
    ingress: topic.meta?.metaDescription,
    subjects: topic.breadcrumbs?.map(crumb => ({
      url: topic.path,
      title: crumb?.[0],
      breadcrumb: crumb,
    })),
    contentType: 'topic',
  };
};

interface Props {
  topics: GQLTopic[];
}

const MovedTopicPage = ({ topics, t }: Props & tType) => {
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

export default injectT(MovedTopicPage);
