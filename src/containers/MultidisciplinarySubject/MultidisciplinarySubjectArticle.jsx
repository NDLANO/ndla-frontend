/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Breadcrumblist,
  MultidisciplinarySubjectHeader,
  ArticleSideBar,
  OneColumn,
} from '@ndla/ui';

import Article from '../../components/Article/Article';
import Resources from '../Resources/Resources';
import { useGraphQuery } from '../../util/runQueries';
import { topicQuery } from '../../queries';
import { scrollToRef } from '../SubjectPage/subjectPageHelpers';
import { getUrnIdsFromProps } from '../../routeHelpers';

const MultidisciplinarySubjectArticle = ({ match, locale }) => {
  const { topicId } = getUrnIdsFromProps({ match });

  const { data, loading } = useGraphQuery(topicQuery, {
    variables: { topicId },
  });

  const [pageUrl, setPageUrl] = useState('');
  useEffect(() => {
    setPageUrl(window.location);
  }, []);

  const resourcesRef = useRef(null);

  if (loading) {
    return null;
  }

  const onLinkToResourcesClick = () => {
    scrollToRef(resourcesRef, 0);
  };

  const { topic, resourceTypes } = data;
  const subjects = topic.filters.map(filter => {
    if (filter.name === 'Folkehelse og livsmestring') return 'publicHealth';
    if (filter.name === 'Demokrati og medborgerskap') return 'democracy';
    if (filter.name === 'Bærekraftig utvikling') return 'climate';
    return null;
  });
  const subjectsLinks = topic.filters.map(filter => ({
    label: filter.name,
    url: '#',
  }));

  return (
    <>
      <>
        <Breadcrumblist hideOnNarrow items={[]} startOffset={268}>
          <ArticleSideBar
            copyPageUrlLink={pageUrl}
            onLinkToResourcesClick={onLinkToResourcesClick}
            linkToResources="#"
          />
        </Breadcrumblist>
        <MultidisciplinarySubjectHeader
          subjects={subjects}
          subjectsLinks={subjectsLinks}
        />
      </>
      <OneColumn>
        <Article article={topic.article} locale={locale} />
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
  match: PropTypes.shape({
    params: PropTypes.shape({
      subjectId: PropTypes.string.isRequired,
      topicId: PropTypes.string,
    }).isRequired,
  }).isRequired,
  locale: PropTypes.string,
};

export default MultidisciplinarySubjectArticle;
