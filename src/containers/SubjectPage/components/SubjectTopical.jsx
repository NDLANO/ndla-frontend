/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Image, SubjectArchive } from 'ndla-ui';
import { injectT } from 'ndla-i18n';
import { GraphQLSubjectPageTopicalShape } from '../../../graphqlShapes';

const SubjectTopical = ({ topical, t }) => {
  if (!topical || !topical.resource || !topical.resource.meta) {
    return null;
  }
  return (
    <SubjectArchive
      featuringArticle={{
        media: (
          <Image
            alt="Forstørrelsesglass"
            src={topical.resource.meta.metaImage}
          />
        ),
        heading: topical.resource.meta.title,
        description: topical.resource.meta.metaDescription,
        url: '#1',
      }}
      archiveArticles={[]}
      sectionHeading={t('subjectPage.subjectArchive.heading')}
      messages={{
        archive: t('subjectPage.subjectArchive.archive'),
        close: t('subjectPage.subjectArchive.close'),
      }}
    />
  );
};

SubjectTopical.propTypes = {
  topical: GraphQLSubjectPageTopicalShape,
};

export default injectT(SubjectTopical);
