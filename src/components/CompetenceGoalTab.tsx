/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { Heading, Text } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
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

const CompetenceGoalTab = ({ items, type }: Props) => {
  const { t } = useTranslation();
  return (
    <ContentWrapper>
      <ItemsWrapper>
        {items.map((item, index) => (
          <CompetenceItemWrapper key={index}>
            <ContentWrapper>
              <Heading textStyle="title.large" asChild consumeCss>
                <h2>{item.title}</h2>
              </Heading>
              {type === "goal" && <Text>{t("competenceGoals.competenceGoalTitle")}</Text>}
            </ContentWrapper>
            <CompetenceItem item={item} showLinks />
          </CompetenceItemWrapper>
        ))}
      </ItemsWrapper>
      <div>
        {`${t("competenceGoals.licenseData")} `}
        <SafeLink to="https://data.norge.no/nlod/no" target="_blank">
          NLOD
        </SafeLink>
        {`, ${t("competenceGoals.licenseFrom")} `}
        <SafeLink to="https://data.udir.no/" target="_blank">
          data.udir.no
        </SafeLink>
      </div>
    </ContentWrapper>
  );
};

interface CompetenceItemProps {
  item: CompetenceGoalType | CoreElementType;
  isOembed?: boolean;
  showLinks?: boolean;
}

const ContentWrapper = styled("div", { base: { display: "flex", flexDirection: "column", gap: "medium" } });

const ItemsWrapper = styled("div", { base: { display: "flex", flexDirection: "column", gap: "xxlarge" } });

const CompetenceItemWrapper = styled("div", {
  base: { display: "flex", flexDirection: "column", gap: "xsmall", alignItems: "flex-start" },
});

const OuterList = styled("ul", { base: { display: "flex", flexDirection: "column", gap: "xxsmall" } });

const OuterListItem = styled("li", { base: { display: "flex", flexDirection: "column", gap: "xsmall" } });

const InnerList = styled("ul", {
  base: {
    listStyle: "outside",
    paddingInlineStart: "large",
    "& li": {
      marginBlock: "xsmall",
    },
  },
});

const SafeLinkWrapper = styled("span", { base: { marginLeft: "xsmall" } });

const CoreElementWrapper = styled("div", { base: { display: "flex", flexDirection: "column", gap: "xsmall" } });

export const CompetenceItem = ({ item, isOembed, showLinks = false }: CompetenceItemProps) => {
  const { t } = useTranslation();
  return (
    <OuterList>
      {item.elements?.map((element) => (
        <OuterListItem key={element.id}>
          <Heading textStyle="label.large" fontWeight="bold" asChild consumeCss>
            <h3>{element.title}</h3>
          </Heading>
          {"goals" in element ? (
            <InnerList>
              {element.goals.map((goal) => (
                <li key={goal.id}>
                  <Text>
                    {goal.text}
                    {showLinks && (
                      <SafeLinkWrapper>
                        <SafeLink to={goal.url} target={isOembed ? "_blank" : "_self"}>
                          {t("competenceGoals.competenceGoalResourceSearchText", { code: goal.id })}
                        </SafeLink>
                      </SafeLinkWrapper>
                    )}
                  </Text>
                </li>
              ))}
            </InnerList>
          ) : (
            <CoreElementWrapper>
              <Text>{element.text}</Text>
              {showLinks && (
                <SafeLink to={element.url} target={isOembed ? "_blank" : "_self"}>
                  {t("competenceGoals.coreResourceSearchText", { code: element.id })}
                </SafeLink>
              )}
            </CoreElementWrapper>
          )}
        </OuterListItem>
      ))}
    </OuterList>
  );
};

export default CompetenceGoalTab;
