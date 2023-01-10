/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { withTracker } from '@ndla/tracker';
import { FeideUserApiType, Programme } from '@ndla/ui';
import { Helmet } from 'react-helmet-async';
import { WithTranslation, withTranslation } from 'react-i18next';
import { SKIP_TO_CONTENT_ID } from '../../constants';
import { LocaleType, ProgrammeType } from '../../interfaces';
import { htmlTitle } from '../../util/titleHelper';
import { getAllDimensions } from '../../util/trackingUtil';
import { mapGradesData } from './ProgrammePage';
import { GQLSubjectInfoFragment } from '../../graphqlTypes';
import SocialMediaMetadata from '../../components/SocialMediaMetadata';

const getDocumentTitle = ({
  programme,
  grade,
  locale,
  t,
}: Pick<Props, 'programme' | 'grade' | 'locale' | 't'>) => {
  return htmlTitle(`${programme.name[locale]} - ${grade}`, [
    t('htmlTitles.titleTemplate'),
  ]);
};

interface Props extends WithTranslation {
  locale: LocaleType;
  user?: FeideUserApiType;
  subjects?: GQLSubjectInfoFragment[];
  programme: ProgrammeType;
  grade: string;
}

const ProgrammeContainer = ({
  programme,
  subjects,
  locale,
  grade,
  t,
}: Props) => {
  const heading = programme.name[locale];
  const grades = mapGradesData(programme.grades, subjects || [], locale);
  const socialMediaTitle = `${programme.name[locale]} - ${grade}`;
  const metaDescription = programme.meta?.description?.[locale];
  const image = programme.image?.url || '';
  const pageTitle = getDocumentTitle({ programme, grade, locale, t });
  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <SocialMediaMetadata
        title={socialMediaTitle}
        description={metaDescription}
        imageUrl={image}
      />
      <Programme
        headingId={SKIP_TO_CONTENT_ID}
        heading={heading}
        grades={grades}
        image={image}
        selectedGrade={grade.toLowerCase()}
      />
    </>
  );
};

ProgrammeContainer.getDocumentTitle = getDocumentTitle;

ProgrammeContainer.getDimensions = (props: Props) => {
  const { programme, grade, locale, user } = props;
  const subjectName = `${programme.name[locale]} - ${grade}`;
  return getAllDimensions(
    { subject: { name: subjectName }, user },
    undefined,
    false,
  );
};

export default withTranslation()(withTracker(ProgrammeContainer));
