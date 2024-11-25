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
import { CheckboxHiddenInput } from "@ark-ui/react";
import { CheckLine } from "@ndla/icons/editor";
import {
  CheckboxControl,
  CheckboxGroup,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxRoot,
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsRoot,
  TabsTrigger,
  Text,
  MessageBox,
  FieldsetRoot,
  FieldsetLegend,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { GQLSubjectInfoFragment } from "../../../graphqlTypes";

const OuterList = styled("ul", {
  base: {
    listStyle: "none",
    tablet: {
      columnCount: "2",
      gap: "medium",
    },
    tabletWide: {
      columnCount: "3",
    },
  },
});

const OuterListItem = styled("li", {
  base: {
    breakInside: "avoid",
  },
});

const StyledMessageBox = styled(MessageBox, {
  base: {
    marginBlockStart: "medium",
  },
});

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

const SubjectList = ({ subjects, onToggleSubject, selectedSubjects = [] }: SubjectListProps) => {
  const { t } = useTranslation();

  return (
    <OuterList>
      {Object.entries(subjects).map(([letter, subjects]) => {
        return (
          <OuterListItem key={letter}>
            <FieldsetRoot>
              <FieldsetLegend
                textStyle="title.large"
                color="text.strong"
                aria-label={t("searchPage.subjectLetter", { letter })}
              >
                {letter}
              </FieldsetLegend>
              <CheckboxGroup css={{ marginBlockEnd: "small" }}>
                {subjects.map((subject) => (
                  <CheckboxRoot
                    key={subject.name}
                    checked={selectedSubjects.includes(subject.id)}
                    onCheckedChange={() => onToggleSubject(subject.id)}
                    css={{ paddingBlock: "4xsmall" }}
                  >
                    <CheckboxControl>
                      <CheckboxIndicator asChild>
                        <CheckLine />
                      </CheckboxIndicator>
                    </CheckboxControl>
                    <CheckboxLabel>{subject.name}</CheckboxLabel>
                    <CheckboxHiddenInput />
                  </CheckboxRoot>
                ))}
              </CheckboxGroup>
            </FieldsetRoot>
          </OuterListItem>
        );
      })}
    </OuterList>
  );
};

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
      if (category.visible) {
        data.push({
          title: t(`subjectCategories.${category.type}`),
          id: category.type,
          content: (
            <>
              {!!category.message && (
                <StyledMessageBox variant="warning">
                  <Text>{category.message}</Text>
                </StyledMessageBox>
              )}
              <SubjectList
                subjects={groupBy(sortedSubjects, (s) => s.name[0]?.toUpperCase())}
                onToggleSubject={onToggleSubject}
                selectedSubjects={selectedSubjects}
              />
            </>
          ),
        });
      }
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
    <TabsRoot
      defaultValue={tabs[0]?.id}
      orientation="horizontal"
      variant="line"
      translations={{ listLabel: t("tabs.subjectFilter") }}
    >
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id}>
            {tab.title}
          </TabsTrigger>
        ))}
        <TabsIndicator />
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id}>
          {tab.content}
        </TabsContent>
      ))}
    </TabsRoot>
  );
};

export default SubjectFilter;
