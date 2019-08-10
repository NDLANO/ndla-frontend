/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { injectT } from '@ndla/i18n';
import { BlogPostWrapper, BlogPost, SubjectSectionTitle } from '@ndla/ui';

const BlogPosts = ({ t }) => (
  <section>
    <SubjectSectionTitle>{t('welcomePage.blog')}</SubjectSectionTitle>
    <BlogPostWrapper>
      <BlogPost
        text="Elever arbeider i grupper"
        image={{
          url: '/static/elev-samarbeid.jpg',
          alt: 'Elever arbeider i grupper',
        }}
        externalLink="https://blogg.ndla.no/2018/11/hvordan-lage-gode-grupper-med-elever/"
        linkText="Besøk vår fagblogg"
        linkTextShort="Fagblogg"
        license="CC BY-NC-SA 4.0 Opphav: Scanpix.no"
      />
      <BlogPost
        text="Prosjektarbeid på tvers av fag"
        image={{
          url: '/static/student-grupper.jpg',
          alt: 'Elever arbeider i grupper',
        }}
        externalLink="https://blogg.ndla.no/2019/03/prosjektarbeid-pa-tvers-av-fag-kuben-vgs/"
        linkText="Besøk vår fagblogg"
        linkTextShort="Fagblogg"
        license="CC BY-NC-SA 4.0 Opphav: Scanpix.no"
      />
    </BlogPostWrapper>
  </section>
);

export default injectT(BlogPosts);
