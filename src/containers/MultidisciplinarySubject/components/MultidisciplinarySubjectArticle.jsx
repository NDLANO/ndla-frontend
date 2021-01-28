/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import {
  ArticleSideBar,
  Breadcrumblist,
  MultidisciplinarySubjectHeader,
  OneColumn,
} from '@ndla/ui';
import { injectT } from '@ndla/i18n';
import { withTracker } from '@ndla/tracker';
import { scrollToRef } from '../../SubjectPage/subjectPageHelpers';

import Article from '../../../components/Article';
import Resources from '../../Resources/Resources';

const filterCodes = {
  'Folkehelse og livsmestring': 'publicHealth',
  'Demokrati og medborgerskap': 'democracy',
  'Bærekraftig utvikling': 'climate',
};

const MultidisciplinarySubjectArticle = ({
  pageUrl,
  topic,
  locale,
  resourceTypes,
}) => {
  const resourcesRef = useRef(null);
  const onLinkToResourcesClick = e => {
    e.preventDefault();
    scrollToRef(resourcesRef, 0);
  };

  // "Base topics" are considered subjects
  const subjects = topic.pathTopics.map(
    listOfTopics => filterCodes[listOfTopics[0].name],
  );
  const subjectsLinks = topic.pathTopics.map(listOfTopics => ({
    label: listOfTopics[0].name,
    url: listOfTopics[0].path,
  }));

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
  pageUrl: PropTypes.string,
  topic: PropTypes.shape({
    article: PropTypes.shape({}),
    pathTopics: PropTypes.array,
  }).isRequired,
  locale: PropTypes.string,
  resourceTypes: PropTypes.array,
};

MultidisciplinarySubjectArticle.getDocumentTitle = ({ t, topic }) => {
  return `${topic.name || ''}${t('htmlTitles.titleTemplate')}`;
};

MultidisciplinarySubjectArticle.willTrackPageView = (
  trackPageView,
  currentProps,
) => {
  const { topic } = currentProps;
  if (topic.article) {
    trackPageView(currentProps);
  }
};

export default injectT(withTracker(MultidisciplinarySubjectArticle));
