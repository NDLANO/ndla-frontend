/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Breadcrumblist, MultidisciplinarySubjectHeader, ArticleSideBar, OneColumn } from '@ndla/ui';

import Article from '../../components/Article/Article';
import Resources from '../Resources/Resources';
import { useGraphQuery } from '../../util/runQueries';
import { topicQuery } from '../../queries';
import { scrollToRef } from '../SubjectPage/subjectPageHelpers';

const MultidisciplinarySubjectArticle = ({ topicId, subjects, locale }) => {

  const { data, loading } = useGraphQuery(topicQuery, {
    variables: { topicId },
  });

  const resourcesRef = useRef(null);

  if (loading) {
    return null;
  }

  const subjectsLinks = [];

  if (subjects.includes('climate')) {
    subjectsLinks.push({
      label: 'Bærekraftig utvikling',
      url: '#',
    });
  }
  if (subjects.includes('democracy')) {
    subjectsLinks.push({
      label: 'Demokrati og medborgerskap',
      url: '#',
    });
  }
  if (subjects.includes('publicHealth')) {
    subjectsLinks.push({
      label: 'Folkehelse og livsmestring',
      url: '#',
    });
  }

  const onLinkToResourcesClick = () => {
    scrollToRef(resourcesRef, 0);
  }

  const { topic, resourceTypes } = data;

  return (
    <>
      <>
        <Breadcrumblist hideOnNarrow items={[]} startOffset={268}>
          <ArticleSideBar
            copyPageUrlLink={window.location}
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
        <Article
          article={topic.article}
          locale={locale}
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
  )
}

MultidisciplinarySubjectArticle.propTypes = {
  subjects: PropTypes.arrayOf(PropTypes.string).isRequired,
  topicId: PropTypes.string.isRequired,
  locale: PropTypes.string,
};

export default MultidisciplinarySubjectArticle;