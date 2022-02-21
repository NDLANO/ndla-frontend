/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { withTracker } from '@ndla/tracker';
import { Programme } from '@ndla/ui';
import React from 'react';
import { Helmet } from 'react-helmet';
import { WithTranslation, withTranslation } from 'react-i18next';
import { LocaleType, ProgrammeType } from '../../interfaces';
import { FeideUserWithGroups } from '../../util/feideApi';
import { htmlTitle } from '../../util/titleHelper';
import { getAllDimensions } from '../../util/trackingUtil';
import { mapGradesData } from './ProgrammePage';
import { GQLSubjectInfoFragment } from '../../graphqlTypes';

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
  user?: FeideUserWithGroups;
  subjects?: GQLSubjectInfoFragment[];
  programme: ProgrammeType;
  grade: string;
  onGradeChange: (newGrade: string) => void;
}

const ProgrammeContainer = ({
  programme,
  subjects,
  locale,
  onGradeChange,
  grade,
  t,
}: Props) => {
  const heading = programme.name[locale];
  const grades = mapGradesData(programme.grades, subjects || [], locale);
  const metaDescription = programme.meta?.description?.[locale];
  const image = programme.image?.url || '';
  return (
    <>
      <Helmet>
        <title>{getDocumentTitle({ programme, grade, locale, t })}</title>
        {metaDescription && (
          <meta name="description" content={metaDescription} />
        )}
      </Helmet>
      <Programme
        heading={heading}
        grades={grades}
        image={image}
        selectedGrade={grade.toLowerCase()}
        onChangeGrade={grade => onGradeChange(grade)}
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
