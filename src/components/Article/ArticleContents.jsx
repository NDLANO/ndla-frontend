/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { injectT } from '@ndla/i18n';
import {
  ArticleWrapper,
  LayoutItem,
  ArticleHeaderWrapper,
  ArticleIntroduction,
  ArticleByline,
  ArticleContent,
  ArticleFootNotes
} from '@ndla/ui';

import LicenseBox from '../license/LicenseBox';
import { ArticleShape } from '../../shapes';

const ArticleContents = ({ article, locale, t }) => {
  const renderMarkdown = text => text;

  return (
      <ArticleWrapper modifier='clean-in-context'>
        <LayoutItem layout='extend'>
          <ArticleHeaderWrapper>
            <ArticleIntroduction renderMarkdown={renderMarkdown}>
              {article.introduction}
            </ArticleIntroduction>
            <ArticleByline
              licenseBox={
              <LicenseBox 
                article={article}
                locale={locale}
                t={t}/>}
              {...{
                authors: article.copyright?.creators,
                published: article.published,
                license: article.copyright?.license?.license,
              }}
            />
          </ArticleHeaderWrapper>
        </LayoutItem>
        <LayoutItem layout='extend'>
          <ArticleContent content={article.content}/>
        </LayoutItem>
        <LayoutItem layout='extend'>
          {article.metadata?.footnotes?.length && 
            <ArticleFootNotes footNotes={article.metaData?.footnotes}/>
          }
        </LayoutItem>
      </ArticleWrapper>
    );
}

ArticleContents.propTypes = {
  article: ArticleShape
};

export default injectT(ArticleContents);