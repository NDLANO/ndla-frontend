/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { BookReadFill } from "@ndla/icons/common";
import { Heading, Text } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { Heading as OldHeading, Text as OldText } from "@ndla/typography";
import { CompetenceGoalsType } from "../interfaces";

interface Props {
  items: CompetenceGoalType[] | CoreElementType[];
  type: CompetenceType;
  isOembed?: boolean;
}

export interface CompetenceGoalType {
  title: string;
  elements?: {
    id: string;
    title: string;
    goals: {
      id: string;
      text: string;
      url: string;
      type: CompetenceGoalsType;
    }[];
  }[];
}

export interface CoreElementType {
  title: string;
  elements: {
    id: string;
    title: string;
    text: string;
    url: string;
  }[];
}

type CompetenceType = "goal" | "element";
// TODO: adjust according to new design
const CompetenceGoalTab = ({ items, type }: Props) => {
  const { t } = useTranslation();
  return (
    <div>
      {items.map((item, index) => (
        <CompetenceItemWrapper key={index}>
          <hgroup>
            <OldHeading element="h2" headingStyle="h2" margin="none">
              <BookReadFill />
              {item.title}
            </OldHeading>
            {type === "goal" && <OldText margin="none">{t("competenceGoals.competenceGoalTitle")}</OldText>}
          </hgroup>
          <CompetenceItem item={item} showLinks />
        </CompetenceItemWrapper>
      ))}
      <span>
        {`${t("competenceGoals.licenseData")} `}
        <SafeLink to="https://data.norge.no/nlod/no" target="_blank">
          NLOD
        </SafeLink>
        {`, ${t("competenceGoals.licenseFrom")} `}
        <SafeLink to="https://data.udir.no/" target="_blank">
          data.udir.no
        </SafeLink>
      </span>
    </div>
  );
};

interface CompetenceItemProps {
  item: CompetenceGoalType | CoreElementType;
  isOembed?: boolean;
  showLinks?: boolean;
}

const CompetenceItemWrapper = styled("div", {
  base: { display: "flex", flexDirection: "column", gap: "small", alignItems: "flex-start" },
});

const OuterList = styled("ul", { base: { display: "flex", flexDirection: "column", gap: "xxsmall" } });

const InnerList = styled("ul", { base: { display: "flex", flexDirection: "column", gap: "xsmall" } });

const ItemWrapper = styled("div", {
  base: {
    display: "flex",
    gridTemplateColumns: "1fr",
    alignItems: "center",
    gap: "small",
    "&[data-show-links='true']": { gridTemplateColumns: "3fr 1fr" },
  },
});

export const CompetenceItem = ({ item, isOembed, showLinks = false }: CompetenceItemProps) => {
  const { t } = useTranslation();
  return (
    <OuterList>
      {item.elements?.map((element) => (
        <li key={element.id}>
          <Heading textStyle="label.large" fontWeight="bold" asChild consumeCss>
            <h3>{element.title}</h3>
          </Heading>
          {"goals" in element ? (
            <InnerList>
              {element.goals.map((goal) => (
                <li key={goal.id}>
                  <ItemWrapper data-show-links={showLinks}>
                    <Text>{goal.text}</Text>
                    {showLinks && (
                      <SafeLink to={goal.url} target={isOembed ? "_blank" : "_self"}>
                        {t("competenceGoals.competenceGoalResourceSearchText", { code: goal.id })}
                      </SafeLink>
                    )}
                  </ItemWrapper>
                </li>
              ))}
            </InnerList>
          ) : (
            <div>
              <Text>{element.text}</Text>
              {showLinks && (
                <SafeLink to={element.url} target={isOembed ? "_blank" : "_self"}>
                  {t("competenceGoals.coreResourceSearchText", { code: element.id })}
                </SafeLink>
              )}
            </div>
          )}
        </li>
      ))}
    </OuterList>
  );
};

export default CompetenceGoalTab;
