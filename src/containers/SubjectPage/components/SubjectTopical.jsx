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
import { toSubjects } from '../../../routeHelpers';

const SubjectTopical = ({ topical, t }) => {
  if (!topical || !topical.resource || !topical.resource.meta) {
    return null;
  }
  const {
    resource: {
      meta: { metaImage, title, metaDescription },
      path,
    },
  } = topical;

  return (
    <SubjectArchive
      featuringArticle={{
        media: metaImage ? (
          <Image alt={metaImage.alt} src={metaImage.url} />
        ) : (
          <Image alt="" src="" />
        ),
        heading: title,
        description: metaDescription,
        url: toSubjects() + path,
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
