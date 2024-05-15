/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import groupBy from "lodash/groupBy";
import sortBy from "lodash/sortBy";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { colors, mq, breakpoints, spacing } from "@ndla/core";
import { CheckboxItem, Label } from "@ndla/forms";
import { Tabs } from "@ndla/tabs";
import { Heading } from "@ndla/typography";
import { MessageBox } from "@ndla/ui";
import { GQLSubjectInfoFragment } from "../../../graphqlTypes";

const StyledWrapper = styled.nav`
  margin: 32px 0 0;
  max-width: 1040px;
`;

const OuterList = styled.ul`
  list-style: none;
  margin: ${spacing.normal} 0 0;
  padding: 0;
  ${mq.range({ from: breakpoints.tablet })} {
    column-count: 2;
    gap: ${spacing.normal};
  }
  ${mq.range({ from: breakpoints.tabletWide })} {
    column-count: 3;
    gap: ${spacing.normal};
  }
`;

const OuterListItem = styled.li`
  padding: 0;
  break-inside: avoid;
`;

const StyledLetterItem = styled(Heading)`
  color: ${colors.brand.primary};
  margin: 0 !important;
  margin-left: ${spacing.normal} !important;
`;

const MessageBoxWrapper = styled.div`
  padding-top: ${spacing.normal};
`;

const InnerList = styled.ul`
  display: flex;
  padding: 0;
  flex-direction: column;
  list-style: none;
  flex-wrap: wrap;
`;

const InnerListItem = styled.li`
  display: flex;
  align-items: center;
  gap: ${spacing.small};
  padding: 0;
  margin-bottom: ${spacing.xxsmall};
  break-inside: avoid;
`;

const StyledLabel = styled(Label)`
  color: ${colors.brand.primary};
`;

const StyledCheckboxItem = styled(CheckboxItem)`
  min-width: ${spacing.nsmall};
  min-height: ${spacing.nsmall};
  max-height: ${spacing.nsmall};
  max-width: ${spacing.nsmall};
`;

interface Category {
  type?: string;
  visible?: boolean;
  message?: string;
  subjects: GQLSubjectInfoFragment[];
}

interface SubjectListProps {
  subjects: Record<string, GQLSubjectInfoFragment[]>;
  onToggleSubject: (id: string) => void;
  selectedSubjects: string[];
}

const SubjectList = ({ subjects, onToggleSubject, selectedSubjects = [] }: SubjectListProps) => (
  <OuterList>
    {Object.entries(subjects).map(([letter, subjects]) => {
      return (
        <OuterListItem key={letter}>
          <StyledLetterItem element="h2" headingStyle="h2">
            {letter}
          </StyledLetterItem>
          <InnerList>
            {subjects.map((subject) => (
              <InnerListItem key={subject.name}>
                <StyledCheckboxItem
                  id={subject.id}
                  checked={selectedSubjects.includes(subject.id)}
                  onCheckedChange={() => onToggleSubject(subject.id)}
                />
                <StyledLabel htmlFor={subject.id} textStyle="meta-text-small">
                  {subject.name}
                </StyledLabel>
              </InnerListItem>
            ))}
          </InnerList>
        </OuterListItem>
      );
    })}
  </OuterList>
);

interface Props {
  categories: Category[];
  onToggleSubject: (id: string) => void;
  selectedSubjects: string[];
}

const SubjectFilter = ({ categories, onToggleSubject, selectedSubjects }: Props) => {
  const { t } = useTranslation();

  const tabs = useMemo(() => {
    const allSubjects: GQLSubjectInfoFragment[] = [];
    const data = [];
    categories.forEach((category) => {
      allSubjects.push(...category.subjects);
      const sortedSubjects = sortBy(category.subjects, (s) => s.name);
      category.visible &&
        data.push({
          title: t(`subjectCategories.${category.type}`),
          id: category.type,
          content: (
            <>
              {category.message && (
                <MessageBoxWrapper>
                  <MessageBox>{category.message}</MessageBox>
                </MessageBoxWrapper>
              )}
              <SubjectList
                subjects={groupBy(sortedSubjects, (s) => s.name[0]?.toUpperCase())}
                onToggleSubject={onToggleSubject}
                selectedSubjects={selectedSubjects}
              />
            </>
          ),
        });
    });

    const allSubjectsSorted = sortBy(allSubjects, (s) => s.name);

    data.push({
      title: t("frontpageMenu.allsubjects"),
      id: "allsubjects",
      content: (
        <SubjectList
          subjects={groupBy(allSubjectsSorted, (s) => s.name[0]?.toUpperCase())}
          onToggleSubject={onToggleSubject}
          selectedSubjects={selectedSubjects}
        />
      ),
    });

    return data;
  }, [categories, onToggleSubject, selectedSubjects, t]);

  return (
    <StyledWrapper>
      <Tabs tabs={tabs} />
    </StyledWrapper>
  );
};

export default SubjectFilter;
