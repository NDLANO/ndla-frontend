/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import {
  OneColumn,
  SubjectSectionTitle,
  BlogPost,
  BlogPostWrapper,
  FFFrontpageHeader,
  FFFrontpageInfo,
} from '@ndla/ui';

import { fetchArticle } from '../ArticlePage/articleApi';
import Article from '../../components/Article';

const FFFrontPage = ({ t, locale }) => {
  const [article, setArticle] = useState(null);

  useEffect(() => {
    fetchArticle(21411, locale).then(article => setArticle(article));
  }, []);

  return (
    <Fragment>
      <FFFrontpageHeader />
      <main>
        <OneColumn>
          <FFFrontpageInfo>
            <OneColumn noPadding>
              <Article locale={locale} article={article} modifier="clean" />
            </OneColumn>
          </FFFrontpageInfo>
          <SubjectSectionTitle>
            {t('fagfornyelse.frontpage.blogHeading')}
          </SubjectSectionTitle>
          <BlogPostWrapper oneColumn>
            <BlogPost
              image={{
                url: '/static/fagfornyelse-blog.jpg',
              }}
              text={t('blogPosts.blog1.text')}
              externalLink={t('blogPosts.blog1.externalLink')}
              linkText={t('blogPosts.blog1.linkText')}
              license={t('blogPosts.blog1.license')}
              licenseAuthor={t('blogPosts.blog1.licenseAuthor')}
              locale={locale}
              oneColumn
            />
          </BlogPostWrapper>
        </OneColumn>
      </main>
    </Fragment>
  );
};

FFFrontPage.propTypes = {
  locale: PropTypes.string.isRequired,
};

export default injectT(FFFrontPage);
