/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from '@apollo/client';
import { Image, SubjectArchive } from '@ndla/ui';
import { useTranslation } from 'react-i18next';
import { GQLSubjectTopical_TaxonomyEntityFragment } from '../../../graphqlTypes';
import SubjectPageFlexChild from './SubjectPageFlexChild';

interface Props {
  topical?: GQLSubjectTopical_TaxonomyEntityFragment;
  twoColumns?: boolean;
}

const SubjectTopical = ({ topical, twoColumns = false }: Props) => {
  const { t } = useTranslation();
  if (!topical || !topical.meta) {
    return null;
  }
  const {
    meta: { metaImage, title, metaDescription },
    path,
  } = topical;

  return (
    <SubjectPageFlexChild twoColumns={twoColumns}>
      <SubjectArchive
        // This heading level is possibly wrong. Hard to say, as the component is unused.
        headingLevel="h2"
        featuringArticle={{
          media:
            metaImage && metaImage.url ? (
              <Image alt={metaImage.alt} src={metaImage.url} />
            ) : null,
          heading: title,
          description: metaDescription ?? '',
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

SubjectTopical.fragments = {
  topical: gql`
    fragment SubjectTopical_TaxonomyEntity on Resource {
      path
      meta {
        title
        metaDescription
        metaImage {
          url
          alt
        }
      }
    }
  `,
};

export default SubjectTopical;
