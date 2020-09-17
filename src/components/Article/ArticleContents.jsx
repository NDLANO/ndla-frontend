/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Remarkable } from 'remarkable';
import { injectT } from '@ndla/i18n';
import {
  ArticleWrapper,
  LayoutItem,
  ArticleHeaderWrapper,
  ArticleIntroduction,
  ArticleByline,
  ArticleContent,
  ArticleFootNotes,
} from '@ndla/ui';

import LicenseBox from '../license/LicenseBox';
import { ArticleShape } from '../../shapes';

const ArticleContents = ({
  article,
  copyPageUrlLink,
  locale,
  modifier = 'clean',
  t,
}) => {
  const markdown = useMemo(() => {
    const md = new Remarkable({ breaks: true });
    md.inline.ruler.enable(['sub', 'sup']);
    md.block.ruler.disable(['list']);
    return md;
  }, []);

  const renderMarkdown = text => {
    return markdown.render(text);
  };

  return (
    <ArticleWrapper modifier={modifier}>
      <LayoutItem layout="extend">
        <ArticleHeaderWrapper>
          <ArticleIntroduction renderMarkdown={renderMarkdown}>
            {article.introduction}
          </ArticleIntroduction>
        </ArticleHeaderWrapper>
      </LayoutItem>
      <LayoutItem layout="extend">
        <ArticleContent content={article.content} />
      </LayoutItem>
      <LayoutItem layout="extend">
        {article.metadata?.footnotes?.length && (
          <ArticleFootNotes footNotes={article.metaData?.footnotes} />
        )}
      </LayoutItem>
      <LayoutItem layout="extend">
        <ArticleByline
          licenseBox={<LicenseBox article={article} locale={locale} t={t} />}
          copyPageUrlLink={copyPageUrlLink}
          {...{
            authors: article.copyright?.creators,
            published: article.published,
            license: article.copyright?.license?.license,
          }}
        />
      </LayoutItem>
    </ArticleWrapper>
  );
};

ArticleContents.propTypes = {
  article: ArticleShape,
  copyPageUrlLink: PropTypes.string,
  locale: PropTypes.string,
  modifier: PropTypes.string,
};

export default injectT(ArticleContents);
