/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import { I18nextProvider } from 'react-i18next';
import { i18nInstance } from '@ndla/ui';
import IframePageWrapper from './IframePageWrapper';
import IframePage from './IframePage';

const IframePageContainer = ({
  basename,
  status,
  locale,
  taxonomyId,
  location,
  articleId,
  isOembed,
  isTopicArticle,
  resCookie,
}) => {
  return (
    <I18nextProvider i18n={i18nInstance}>
      <IframePageWrapper
        basename={basename}
        resCookie={resCookie}
        locale={locale}>
        <IframePage
          status={status}
          locale={locale}
          taxonomyId={taxonomyId}
          location={location}
          articleId={articleId}
          isOembed={isOembed}
          isTopicArticle={isTopicArticle}
        />
      </IframePageWrapper>
    </I18nextProvider>
  );
};

IframePageContainer.propTypes = {
  basename: PropTypes.string,
  locale: PropTypes.string.isRequired,
  articleId: PropTypes.string,
  taxonomyId: PropTypes.string,
  status: PropTypes.oneOf(['success', 'error']),
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  isOembed: PropTypes.string,
  isTopicArticle: PropTypes.bool,
  resCookie: PropTypes.string,
};

export default IframePageContainer;
