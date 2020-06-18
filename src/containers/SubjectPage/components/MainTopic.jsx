/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { NavigationTopicAbout } from '@ndla/ui';

import { topicQuery } from '../../../queries';
import { useGraphQuery } from '../../../util/runQueries';
import Article from '../../../components/Article';

const MainTopic = ({ topicId, subjectId, filterIds, locale, t }) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setShowContent(false);
  }, [topicId])

  const { data, loading } = useGraphQuery(topicQuery, {
    variables: { topicId, subjectId, filterIds }
  })

  const topic = data?.topic;

  console.log(topic)

  return (
    <NavigationTopicAbout
      heading={topic?.name}
      ingress={topic?.article?.introduction}
      showContent={showContent}
      onToggleShowContent={() => setShowContent(!showContent)}
      isLoading={loading}>
      <Article
        article={topic?.article}
        locale={locale}
        label={t('topicPage.topic')}
        isTopicArticle
      />
    </NavigationTopicAbout>
  );
}

MainTopic.propTypes = {
  topicId: PropTypes.string,
  subjectId: PropTypes.string,
  filterIds: PropTypes.string,
};



export default injectT(MainTopic);