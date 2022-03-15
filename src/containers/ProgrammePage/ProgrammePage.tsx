/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext } from 'react';
import { RouteComponentProps, useHistory, withRouter } from 'react-router';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import { getProgrammeBySlug } from '../../data/programmes';
import { getSubjectById } from '../../data/subjects';
import { createSubjectUrl } from '../../util/programmesSubjectsHelper';
import { LocaleType, ProgrammeGrade, ProgrammeType } from '../../interfaces';
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

const ProgrammePage = ({ match, locale }: Props) => {
  const { user } = useContext(AuthContext);
  const slug = match?.params?.programme;
  const gradeParam = match.params.grade;
  const programmeData = getProgrammeBySlug(slug, locale);
  const programmeGrades = programmeData?.grades;
  const grade = getGradeNameFromProgramme(gradeParam, programmeData);
  const history = useHistory();

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
