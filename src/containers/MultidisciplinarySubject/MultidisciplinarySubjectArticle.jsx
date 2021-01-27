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
  ArticleSideBar,
  Breadcrumblist,
  MultidisciplinarySubjectHeader,
  OneColumn,
} from '@ndla/ui';

import Article from '../../components/Article/Article';
import Resources from '../Resources/Resources';
import { useGraphQuery } from '../../util/runQueries';
import { topicQueryWithPathTopics } from '../../queries';
import { scrollToRef } from '../SubjectPage/subjectPageHelpers';
import { getUrnIdsFromProps } from '../../routeHelpers';
import { fetchGrepCodeTitle } from '../../util/grepApi';

const filterCodes = {
  TT1: 'publicHealth',
  TT2: 'democracy',
  TT3: 'climate',
};

const subjectPaths = {
  TT1:
    'subject:d1fe9d0a-a54d-49db-a4c2-fd5463a7c9e7/topic:3cdf9349-4593-498c-a899-9310133a4788/',
  TT2:
    'subject:d1fe9d0a-a54d-49db-a4c2-fd5463a7c9e7/topic:077a5e01-6bb8-4c0b-b1d4-94b683d91803/',
  TT3:
    'subject:d1fe9d0a-a54d-49db-a4c2-fd5463a7c9e7/topic:a2f5aaa0-ab52-49d5-aabf-e7ffeac47fa2/',
};

const MultidisciplinarySubjectArticle = ({ match, locale }) => {
  const { topicId } = getUrnIdsFromProps({ match });
  const { data, loading } = useGraphQuery(topicQueryWithPathTopics, {
    variables: { topicId },
  });
  const { topic, resourceTypes } = data;

  const [pageUrl, setPageUrl] = useState('');
  const [subjectsLinks, setSubjectsLinks] = useState([]);

  useEffect(() => {
    setPageUrl(window.location);
  }, []);

  useEffect(() => {
    getGrepCodes();
  }, []);

  const getGrepCodes = async () => {
    const { grepCodes } = topic.article;
    const greps = await Promise.all(
      grepCodes.map(async code => {
        const title = await fetchGrepCodeTitle(code, locale);
        return {
          label: title,
          url: subjectPaths[code],
          grepCode: code,
        };
      }),
    );
    setSubjectsLinks(greps);
  };

  const resourcesRef = useRef(null);

  if (loading) {
    return null;
  }

  const onLinkToResourcesClick = e => {
    e.preventDefault();
    scrollToRef(resourcesRef, 0);
  };

  const subjects = subjectsLinks.map(codes => filterCodes[codes.grepCode]);

  return (
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
  match: PropTypes.shape({
    params: PropTypes.shape({
      topicPath: PropTypes.string.isRequired,
    }).isRequired,
    path: PropTypes.string.isRequired,
  }).isRequired,
  locale: PropTypes.string,
};

export default MultidisciplinarySubjectArticle;
