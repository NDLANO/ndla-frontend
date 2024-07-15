/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useComponentSize } from "@ndla/hooks";
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

const StickyHeading = styled("div", {
  base: {
    background: "surface.brand.1.subtle",
    borderRadius: "xsmall",
    borderColor: "stroke.subtle",
    border: "1px solid",
    padding: "xsmall",
    position: "sticky",
    // TODO: this syntax does not work, needs fix
    top: "calc(var(--height)+token(spacing.small))",
    //TODO: Specific design for mobile??
  },
});

interface Props {
  label: string;
  subjects: Subject[];
  favorites: string[] | undefined;
}

const SubjectCategory = ({ label, subjects, favorites }: Props) => {
  const rootRef = useRef<HTMLLIElement>(null);
  const { t } = useTranslation();
  const stickyRef = useRef<HTMLDivElement>(null);
  const { height = 85 } = useComponentSize("masthead");

  return (
    <li ref={rootRef} aria-owns={`subject-${label}`} aria-labelledby={`subject-header-${label}`}>
      <StickyHeading ref={stickyRef} css={{ "--height": `${height}` }}>
        <div>
          <Heading asChild consumeCss textStyle="title.medium" id={`subject-header-${label}`}>
            <h2>{label.toUpperCase()}</h2>
          </Heading>
        </div>
      </StickyHeading>
      <div>
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
      </div>
    </li>
  );
};

export default SubjectCategory;
