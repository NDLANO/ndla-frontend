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
import { Spinner } from '@ndla/icons';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import DefaultErrorMessage from '../../components/DefaultErrorMessage';
import { getProgrammeBySlug } from '../../data/programmes';
import { LocaleType, ProgrammeGrade, ProgrammeType } from '../../interfaces';
import { subjectsQuery } from '../../queries';
import { useGraphQuery } from '../../util/runQueries';
import { GQLSubjectsQuery, GQLSubjectInfoFragment } from '../../graphqlTypes';
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
  subjects: GQLSubjectInfoFragment[],
  locale: LocaleType,
): GradesData[] => {
  return grades.map(grade => {
    const categories = grade.categories.map(category => {
      const categorySubjects = category.subjects.map(subject => {
        const taxSubject = subjects?.find(s => s.id === subject.id) ?? {
          name: '',
          path: '',
          subjectpage: { about: { title: '' } },
        };
        return {
          label: taxSubject.subjectpage?.about?.title || taxSubject.name || '',
          url: taxSubject.path ?? '',
        };
      });
      categorySubjects.sort((a, b) => a.label?.localeCompare(b.label, locale));
      return {
        name: category.name?.[locale] ?? '',
        subjects: categorySubjects,
      };
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
  const { loading, data } = useGraphQuery<GQLSubjectsQuery>(subjectsQuery);
  const programmeData = getProgrammeBySlug(slug, i18n.language);
  const programmeGrades = programmeData?.grades;
  const grade = getGradeNameFromProgramme(gradeParam, programmeData);
  const navigate = useNavigate();

  if (loading) {
    return <Spinner />;
  }

  if (!data) {
    return <DefaultErrorMessage />;
  }

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
      subjects={data.subjects}
      onGradeChange={onGradeChange}
      grade={grade}
      locale={i18n.language}
      user={user}
    />
  );
};

export default ProgrammePage;
