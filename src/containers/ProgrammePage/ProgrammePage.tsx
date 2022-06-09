/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import { getProgrammeBySlug } from '../../data/programmes';
import { getSubjectById } from '../../data/subjects';
import { createSubjectUrl } from '../../util/programmesSubjectsHelper';
import { LocaleType, ProgrammeGrade, ProgrammeType } from '../../interfaces';
import { toProgramme, TypedParams, useTypedParams } from '../../routeHelpers';
import ProgrammeContainer from './ProgrammeContainer';
import { AuthContext } from '../../components/AuthenticationContext';

export interface GradesData {
  name: string;
  categories: {
    missingProgrammeSubjects?: boolean;
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
    return {
      name: grade.name,
      categories,
      missingProgrammeSubjects: grade.missingProgrammeSubjects,
    };
  });
};

interface MatchParams extends TypedParams {
  programme: string;
  grade?: string;
}

export const getGradeNameFromProgramme = (
  grade?: string,
  programme?: ProgrammeType,
) => {
  return grade
    ? programme?.grades.find(g => g.name.toLowerCase() === grade)?.name
    : programme?.grades?.[0]?.name;
};

const ProgrammePage = () => {
  const { i18n } = useTranslation();
  const { programme: slug, grade: gradeParam } = useTypedParams<MatchParams>();
  const { user } = useContext(AuthContext);
  const programmeData = getProgrammeBySlug(slug, i18n.language);
  const programmeGrades = programmeData?.grades;
  const grade = getGradeNameFromProgramme(gradeParam, programmeData);
  const navigate = useNavigate();

  if (!programmeData || !grade) {
    return <NotFoundPage />;
  }

  const onGradeChange = (newGrade: string) => {
    if (!programmeGrades?.some(g => g.name.toLowerCase() === newGrade)) {
      return;
    }
    navigate(toProgramme(slug, newGrade));
  };

  return (
    <ProgrammeContainer
      programme={programmeData}
      onGradeChange={onGradeChange}
      grade={grade}
      locale={i18n.language}
      user={user}
    />
  );
};

export default ProgrammePage;
