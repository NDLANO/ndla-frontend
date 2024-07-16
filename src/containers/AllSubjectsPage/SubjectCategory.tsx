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
import { Subject } from "./interfaces";
import SubjectLink from "./SubjectLink";

export const GridList = styled("ul", {
  base: {
    width: "100%",
    display: "grid",
    gridTemplateColumns: "50% 50%",
    gap: "small",
    marginBlock: "xsmall",
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

interface Props {
  label: string;
  subjects: Subject[];
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
      <GridList
        id={`subject-${label}`}
        aria-label={t("subjectsPage.subjectGroup", {
          category: label === "#" ? t("labels.other") : label,
        })}
      >
        {subjects.map((subject) => (
          <SubjectLink favorites={favorites} key={subject.id} subject={subject} />
        ))}
      </GridList>
    </li>
  );
};

export default SubjectCategory;
