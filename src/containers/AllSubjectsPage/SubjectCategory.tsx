/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { Heading } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import SubjectLink from "./SubjectLink";
import { GQLTaxBase } from "../../graphqlTypes";

export const GridList = styled("ul", {
  base: {
    width: "100%",
    display: "grid",
    gridTemplateColumns: "repeat(2,1fr)",
    gap: "small",
    tabletDown: {
      display: "flex",
      flexDirection: "column",
    },
  },
});

const LetterHeader = styled("div", {
  base: {
    background: "surface.brand.1.subtle",
    borderRadius: "xsmall",
    borderColor: "stroke.subtle",
    border: "1px solid",
    padding: "xsmall",
  },
});

const StyledGridList = styled(GridList, {
  base: {
    marginBlockStart: "xsmall",
    marginBlockEnd: "large",
  },
});

interface Props {
  label: string;
  subjects: GQLTaxBase[];
  favorites: string[] | undefined;
}

const SubjectCategory = ({ label, subjects, favorites }: Props) => {
  const { t } = useTranslation();

  return (
    <li aria-owns={`subject-${label}`} aria-labelledby={`subject-header-${label}`}>
      <LetterHeader id={`subject-header-${label}`}>
        <Heading asChild consumeCss textStyle="title.medium">
          <h2>{label.toUpperCase()}</h2>
        </Heading>
      </LetterHeader>
      <StyledGridList
        id={`subject-${label}`}
        aria-label={t("subjectsPage.subjectGroup", {
          category: label === "#" ? t("labels.other") : label,
        })}
      >
        {subjects.map((subject) => (
          <SubjectLink favorites={favorites} key={subject.id} subject={subject} />
        ))}
      </StyledGridList>
    </li>
  );
};

export default SubjectCategory;
