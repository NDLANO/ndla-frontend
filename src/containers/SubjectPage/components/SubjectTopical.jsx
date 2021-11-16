/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import PropTypes from 'prop-types';
import { Image, SubjectArchive } from '@ndla/ui';
import { useTranslation } from 'react-i18next';
import { GraphQLResourceShape } from '../../../graphqlShapes';
import SubjectPageFlexChild from './SubjectPageFlexChild';

const SubjectTopical = ({ topical, twoColumns }) => {
  const { t } = useTranslation();
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
    <SubjectPageFlexChild twoColumns={twoColumns}>
      <SubjectArchive
        featuringArticle={{
          media:
            metaImage && metaImage.url ? (
              <Image alt={metaImage.alt} src={metaImage.url} />
            ) : null,
          heading: title,
          description: metaDescription,
          url: path,
        }}
        archiveArticles={[]}
        sectionHeading={t('subjectPage.subjectArchive.heading')}
        messages={{
          archive: t('subjectPage.subjectArchive.archive'),
          close: t('subjectPage.subjectArchive.close'),
        }}
      />
    </SubjectPageFlexChild>
  );
};

SubjectTopical.propTypes = {
  topical: GraphQLResourceShape,
  twoColumns: PropTypes.bool,
};

SubjectTopical.defaultProps = {
  twoColumns: false,
};

export default SubjectTopical;
