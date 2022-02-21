/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useContext } from 'react';
import { RouteComponentProps, useHistory, withRouter } from 'react-router';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import DefaultErrorMessage from '../../components/DefaultErrorMessage';
import { getAllDimensions } from '../../util/trackingUtil';
import { getProgrammeBySlug } from '../../data/programmes';
import { htmlTitle } from '../../util/titleHelper';
import { FeideUserWithGroups } from '../../util/feideApi';
import { LocaleType, ProgrammeGrade, ProgrammeType } from '../../interfaces';
import { subjectsQuery } from '../../queries';
import { useGraphQuery } from '../../util/runQueries';
import { GQLSubjectsQuery, GQLSubjectInfoFragment } from '../../graphqlTypes';
import { toProgramme } from '../../routeHelpers';
import ProgrammeContainer from './ProgrammeContainer';
import { AuthContext } from '../../components/AuthenticationContext';
import { RootComponentProps } from '../../routes';

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
  subjects: GQLSubjectInfoFragment[],
  locale: LocaleType,
): GradesData[] => {
  return grades.map(grade => {
    const categories = grade.categories.map(category => {
      const categorySubjects = category.subjects.map(subject => {
        const taxSubject = subjects?.find(s => s.id === subject.id) ?? {
          name: '',
          path: '',
        };
        return {
          label: taxSubject.name ?? '',
          url: taxSubject.path ?? '',
        };
      });
      categorySubjects.sort((a, b) => a.label?.localeCompare(b.label, locale));
      return {
        name: category.name?.[locale] ?? '',
        subjects: categorySubjects,
      };
    });
    return { name: grade.name, categories };
  });
};

interface MatchParams {
  programme: string;
  grade?: string;
}

interface Props extends RouteComponentProps<MatchParams>, RootComponentProps {}

export const getGradeNameFromProgramme = (
  grade?: string,
  programme?: ProgrammeType,
) => {
  return grade
    ? programme?.grades.find(g => g.name.toLowerCase() === grade)?.name
    : programme?.grades?.[0]?.name;
};

const ProgrammePage = ({ match, locale, t }: Props) => {
  const { user } = useContext(AuthContext);
  const { loading, data } = useGraphQuery<GQLSubjectsQuery>(subjectsQuery);
  const slug = match?.params?.programme;
  const gradeParam = match.params.grade;
  const programmeData = getProgrammeBySlug(slug, locale);
  const programmeGrades = programmeData?.grades;
  const grade = getGradeNameFromProgramme(gradeParam, programmeData);
  const history = useHistory();

  if (loading) {
    return null;
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
    history.push(toProgramme(slug, newGrade));
  };

  return (
    <ProgrammeContainer
      programme={programmeData}
      onGradeChange={onGradeChange}
      grade={grade}
      locale={locale}
      user={user}
    />
  );
};

export default withRouter(ProgrammePage);
