/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { spacing } from "@ndla/core";
import { MenuBook } from "@ndla/icons/action";
import { Search } from "@ndla/icons/common";
import { SafeLink, SafeLinkButton } from "@ndla/safelink";
import { Heading, Text } from "@ndla/typography";
import { CompetenceGoalsType } from "../interfaces";

const TabWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
  padding: ${spacing.normal} 0px;
`;

interface Props {
  items: CompetenceGoalType[] | CoreElementType[];
  type: CompetenceType;
  isOembed?: boolean;
}

export interface CompetenceGoalType {
  title: string;
  elements: {
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
    <TabWrapper>
      {items.map((item, index) => (
        <CompetenceItem item={item} key={index} type={type} />
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
    </TabWrapper>
  );
};

interface CompetenceItemProps {
  item: CompetenceGoalType | CoreElementType;
  type: CompetenceType;
  isOembed?: boolean;
}

const StyledHeading = styled(Heading)`
  display: flex;
  align-items: center;
  gap: ${spacing.small};
`;

const CompetenceItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${spacing.small};
`;

const OuterList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
  list-style: none;
  margin: 0px;
  padding: 0px;
`;

const InnerList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
`;

const InnerListItem = styled.li`
  margin: 0px;
  padding: 0px;
`;

const OuterListItem = styled.li`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
  margin: 0px;
  padding: 0px;
`;

const ItemWrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  align-items: center;
  gap: ${spacing.small};
`;

const StyledSafeLinkButton = styled(SafeLinkButton)`
  text-align: start;
`;

const CompetenceItem = ({ item, type, isOembed }: CompetenceItemProps) => {
  const { t } = useTranslation();
  return (
    <CompetenceItemWrapper>
      <hgroup>
        <StyledHeading element="h2" headingStyle="h2" margin="none">
          <MenuBook size="normal" />
          {item.title}
        </StyledHeading>
        {type === "goal" && <Text margin="none">{t("competenceGoals.competenceGoalTitle")}</Text>}
      </hgroup>
      <OuterList>
        {item.elements.map((element) => (
          <OuterListItem key={element.id}>
            <Heading element="h3" headingStyle="list-title" margin="none">
              {element.title}
            </Heading>
            {"goals" in element ? (
              <InnerList>
                {element.goals.map((goal) => (
                  <InnerListItem key={goal.id}>
                    <ItemWrapper>
                      <Text textStyle="content-alt" margin="none">
                        {goal.text}
                      </Text>
                      <StyledSafeLinkButton to={goal.url} target={isOembed ? "_blank" : "_self"} variant="outline">
                        <Search size="normal" />
                        {t("competenceGoals.competenceGoalResourceSearchText", { code: goal.id })}
                      </StyledSafeLinkButton>
                    </ItemWrapper>
                  </InnerListItem>
                ))}
              </InnerList>
            ) : (
              <ItemWrapper>
                <Text textStyle="content-alt" margin="none">
                  {element.text}
                </Text>
                <StyledSafeLinkButton to={element.url} target={isOembed ? "_blank" : "_self"} variant="outline">
                  <Search size="normal" />
                  {t("competenceGoals.competenceGoalResourceSearchText", { code: element.id })}
                </StyledSafeLinkButton>
              </ItemWrapper>
            )}
          </OuterListItem>
        ))}
      </OuterList>
    </CompetenceItemWrapper>
  );
};

export default CompetenceGoalTab;
