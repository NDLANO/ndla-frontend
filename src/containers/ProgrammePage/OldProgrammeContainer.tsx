/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTracker } from '@ndla/tracker';
import { FeideUserApiType, Programme } from '@ndla/ui';
import { Helmet } from 'react-helmet-async';
import { TFunction, useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { SKIP_TO_CONTENT_ID } from '../../constants';
import { LocaleType, ProgrammeType } from '../../interfaces';
import { htmlTitle } from '../../util/titleHelper';
import { getAllDimensions } from '../../util/trackingUtil';
import { mapGradesData } from './OldProgrammePage';
import { GQLSubjectInfoFragment } from '../../graphqlTypes';
import SocialMediaMetadata from '../../components/SocialMediaMetadata';

const getDocumentTitle = ({
  programme,
  grade,
  locale,
  t,
}: Pick<Props, 'programme' | 'grade' | 'locale'> & { t: TFunction }) => {
  return htmlTitle(`${programme.name[locale]} - ${grade}`, [
    t('htmlTitles.titleTemplate'),
  ]);
};

interface Props {
  locale: LocaleType;
  user?: FeideUserApiType;
  subjects?: GQLSubjectInfoFragment[];
  programme: ProgrammeType;
  grade: string;
}

const OldProgrammeContainer = ({
  programme,
  subjects,
  locale,
  grade,
  user,
}: Props) => {
  const { t } = useTranslation();
  const { trackPageView } = useTracker();
  const heading = programme.name[locale];
  const grades = mapGradesData(programme.grades, subjects || [], locale);
  const socialMediaTitle = `${programme.name[locale]} - ${grade}`;
  const metaDescription = programme.meta?.description?.[locale];
  const image = programme.image?.url || '';
  const pageTitle = getDocumentTitle({ programme, grade, locale, t });

  useEffect(() => {
    const subjectName = `${programme.name[locale]} - ${grade}`;
    const dims = getAllDimensions(
      { subject: { name: subjectName }, user },
      undefined,
      false,
    );
    trackPageView({
      dimensions: dims.gtm,
      title: getDocumentTitle({ programme, grade, locale, t }),
    });
  }, [grade, locale, programme, t, trackPageView, user]);

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
      <main>
        <Programme
          headingId={SKIP_TO_CONTENT_ID}
          heading={heading}
          grades={grades}
          image={image}
          selectedGrade={grade.toLowerCase()}
        />
      </main>
    </>
  );
};

export default OldProgrammeContainer;
