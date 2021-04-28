/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import IframePageWrapper from './IframePageWrapper';
import IframePage from './IframePage';
import { ResourceTypeShape } from '../shapes';

const IframePageContainer = ({
  basename,
  status,
  locale,
  resourceTypes,
  location,
  articleId,
  isOembed,
  isTopicArticle,
}) => (
  <IframePageWrapper basename={basename} locale={locale}>
    <IframePage
      status={status}
      locale={locale}
      resourceTypes={resourceTypes}
      location={location}
      articleId={articleId}
      isOembed={isOembed}
      isTopicArticle={isTopicArticle}
    />
  </IframePageWrapper>
);

IframePageContainer.propTypes = {
  basename: PropTypes.string,
  locale: PropTypes.shape({
    abbreviation: PropTypes.string.isRequired,
    messages: PropTypes.object.isRequired,
  }).isRequired,
  articleId: PropTypes.string,
  resourceTypes: PropTypes.arrayOf(ResourceTypeShape),
  status: PropTypes.oneOf(['success', 'error']),
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  isOembed: PropTypes.string,
  isTopicArticle: PropTypes.bool,
};

export default IframePageContainer;
