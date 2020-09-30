/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Breadcrumblist, MultidisciplinarySubjectHeader, ArticleSideBar, OneColumn } from '@ndla/ui';

import { LocationShape } from '../../shapes';
import Article from '../../components/Article/Article';
import { useGraphQuery } from '../../util/runQueries';
import { topicQuery } from '../../queries';

const MultidisciplinarySubjectArticle = ({ location, topicId, subjects }) => {

  const { data, loading } = useGraphQuery(topicQuery, {
    variables: { topicId },
  });

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

  return (
    <>
      <>
        <Breadcrumblist hideOnNarrow items={[]} startOffset={268}>
          <ArticleSideBar
            copyPageUrlLink={location}
            onLinkToResourcesClick={() => { }}
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
          article={data.topic.article}
        />
      </OneColumn>
    </>
  )
}

MultidisciplinarySubjectArticle.propTypes = {
  location: LocationShape,
  subjects: PropTypes.arrayOf(PropTypes.string).isRequired,
  topicId: PropTypes.string.isRequired,
};

export default MultidisciplinarySubjectArticle;