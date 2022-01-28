/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { match, RouteComponentProps, useHistory } from 'react-router';
import { Helmet } from 'react-helmet';
import { withTracker } from '@ndla/tracker';
import { Programme } from '@ndla/ui';
import { WithTranslation, withTranslation } from 'react-i18next';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import { getAllDimensions } from '../../util/trackingUtil';
import { getProgrammeBySlug } from '../../data/programmes';
import { getSubjectById } from '../../data/subjects';
import { createSubjectUrl } from '../../util/programmesSubjectsHelper';
import { htmlTitle } from '../../util/titleHelper';
import { FeideUserWithGroups } from '../../util/feideApi';
import { LocaleType, ProgrammeGrade } from '../../interfaces';
import { toProgramme } from '../../routeHelpers';

export interface GradesData {
  name: string;
  categories: {
    name: string;
    subjects: {
      label: string;
      url: string;
    }[];
  }[];
}
export const mapGradesData = (
  grades: ProgrammeGrade[],
  locale: LocaleType,
): GradesData[] => {
  return grades.map(grade => {
    const categories = grade.categories.map(category => {
      const subjects = category.subjects
        .map(subject => {
          const subjectInfo = getSubjectById(subject.id);
          if (subjectInfo) {
            /*const url = toProgrammeSubject(
            programmeSlug,
            subjectInfo.id,
            subjectInfo.filters,
          );*/
            const url = createSubjectUrl(subjectInfo);
            return {
              label: subjectInfo.name?.[locale] ?? '',
              url: url,
            };
          }
          return undefined;
        })
        .filter((c): c is { label: string; url: string } => c !== undefined);
      subjects.sort((a, b) => a.label.localeCompare(b.label, locale));
      return { name: category.name?.[locale] ?? '', subjects };
    });
    return { name: grade.name, categories };
  });
};

const getProgrammeName = (match: match<MatchParams>, locale: LocaleType) => {
  const slug = match?.params?.programme;
  const gradeParam = match.params.grade;
  const programmeData = getProgrammeBySlug(slug, locale);
  const grade = gradeParam
    ? programmeData?.grades.find(
        grade => grade.name.toLowerCase() === gradeParam?.toLowerCase(),
      )?.name
    : validGrades[0];
  const gradeString = grade ? ` - ${grade}` : '';
  const programmeString = programmeData?.name[locale] ?? '';
  return `${programmeString}${gradeString}`;
};

const getDocumentTitle = ({
  match,
  locale,
  t,
}: Pick<Props, 'match' | 'locale' | 't'>) => {
  const name = getProgrammeName(match, locale);
  return htmlTitle(name, [t('htmlTitles.titleTemplate')]);
};

interface MatchParams {
  programme: string;
  grade?: string;
}

interface Props extends RouteComponentProps<MatchParams>, WithTranslation {
  locale: LocaleType;
  user?: FeideUserWithGroups;
}
const validGrades = ['vg1', 'vg2', 'vg3'];

const ProgrammePage = ({ match, locale, t }: Props) => {
  const slug = match?.params?.programme;
  const gradeParam = match.params.grade;
  const programmeData = getProgrammeBySlug(slug, locale);
  const grade = gradeParam
    ? validGrades.find(grade => grade === gradeParam)
    : validGrades[0];
  const history = useHistory();

  if (!programmeData || !grade) {
    return <NotFoundPage />;
  }

  const onGradeChange = (newGrade: string) => {
    if (!validGrades.some(grade => grade === newGrade)) return;
    history.push(toProgramme(slug, newGrade));
  };

  const heading = programmeData.name[locale];
  const grades = mapGradesData(programmeData.grades, locale);
  const documentTitle = getDocumentTitle({ match, locale, t });
  const metaDescription = programmeData.meta?.description?.[locale];
  const image = programmeData.image?.url || '';
  return (
    <>
      <Helmet>
        <title>{documentTitle}</title>
        {metaDescription && (
          <meta name="description" content={metaDescription} />
        )}
      </Helmet>
      <Programme
        heading={heading}
        grades={grades}
        image={image}
        selectedGrade={grade}
        onChangeGrade={onGradeChange}
      />
    </>
  );
};

ProgrammePage.getDocumentTitle = getDocumentTitle;

ProgrammePage.getDimensions = (props: Props) => {
  const { match, locale, user } = props;
  return getAllDimensions(
    { subject: { name: getProgrammeName(match, locale) }, user },
    undefined,
    false,
  );
};

export default withTranslation()(withTracker(ProgrammePage));
