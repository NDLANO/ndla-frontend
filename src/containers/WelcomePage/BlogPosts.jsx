/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { BlogPostWrapper, BlogPost, SubjectSectionTitle } from '@ndla/ui';
import { withTranslation } from 'react-i18next';

const BlogPosts = ({ t, locale }) => (
  <section>
    <SubjectSectionTitle>{t('welcomePage.blog')}</SubjectSectionTitle>
    <BlogPostWrapper>
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
      />
      <BlogPost
        image={{
          url: '/static/aktiviser-elevene.jpg',
        }}
        text={t('blogPosts.blog2.text')}
        externalLink={t('blogPosts.blog2.externalLink')}
        linkText={t('blogPosts.blog2.linkText')}
        license={t('blogPosts.blog2.license')}
        licenseAuthor={t('blogPosts.blog2.licenseAuthor')}
        locale={locale}
      />
    </BlogPostWrapper>
  </section>
);

BlogPosts.propTypes = {
  t: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
};

export default withTranslation()(BlogPosts);
