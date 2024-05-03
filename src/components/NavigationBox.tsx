/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { breakpoints, colors, misc, mq, spacing } from "@ndla/core";
import { Additional, HumanMaleBoard } from "@ndla/icons/common";
import { SafeLinkButton } from "@ndla/safelink";
import { Heading } from "@ndla/typography";
import { useIsNdlaFilm } from "../routeHelpers";

const StyledWrapper = styled.nav`
  margin: ${spacing.normal} 0 ${spacing.mediumlarge};
`;

const StyledHeading = styled(Heading)`
  &[data-inverted="true"] {
    color: ${colors.white};
  }
`;

const StyledList = styled.ul`
  list-style: none;
  padding: 0;
  gap: ${spacing.xsmall};
  display: inline-flex;
  flex-wrap: wrap;
  ${mq.range({ until: breakpoints.mobileWide })} {
    display: flex;
    flex-direction: column;
  }

  &[data-direction="horizontal"] {
    display: flex;
    flex-direction: column;
    ${mq.range({ from: breakpoints.tablet })} {
      gap: ${spacing.nsmall};
      display: grid;
      grid-template-columns: repeat(2, 1fr);
    }
    ${mq.range({ from: breakpoints.tabletWide })} {
      grid-template-columns: repeat(3, 1fr);
    }
  }
`;

const StyledListItem = styled.li`
  padding: 0;
  break-inside: avoid;
`;

const StyledButtonContentText = styled.span`
  display: flex;
  gap: ${spacing.small};
`;

const StyledMarksWrapper = styled.span`
  display: flex;
  gap: ${spacing.xxsmall};
`;

const StyledButtonContentSelected = styled.span`
  width: ${spacing.small};
  height: ${spacing.small};
  border-radius: ${misc.borderRadiusLarge};
  background: ${colors.white};
  flex-shrink: 0;
  align-self: center;
  margin-left: ${spacing.small};
`;

const StyledListElementWrapper = styled.div`
  height: 100%;
  &[data-additional="true"] {
    & > * {
      border: 1px dashed ${colors.brand.dark};
      background-clip: padding-box;
      :hover,
      :focus {
        border: 1px dashed ${colors.brand.dark};
        background-clip: padding-box;
        color: ${colors.white};
      }
      &[data-color-mode="light"][data-selected="false"] {
        border: 1px dashed ${colors.brand.tertiary};
      }
    }
  }
`;

const StyledSafeLinkButton = styled(SafeLinkButton)`
  display: flex;
  flex: 1;
  width: 100%;
  height: 100%;
  text-align: left;
  padding-left: ${spacing.xxsmall};
  justify-content: space-between;
  align-items: unset;
`;

const StyledSpan = styled.span`
  align-self: center;
`;

export type ItemProps = {
  url?: string;
  label: string;
  id?: string;
  selected?: boolean;
  isAdditionalResource?: boolean;
  isRestrictedResource?: boolean;
};

type Props = {
  heading?: string;
  colorMode?: "primary" | "darker" | "light" | "greyLightest" | "greyLighter";
  items?: ItemProps[];
  listDirection?: "horizontal" | "floating";
};

export const NavigationBox = ({ heading, colorMode = "primary", items, listDirection = "horizontal" }: Props) => {
  const inverted = useIsNdlaFilm();
  const { t } = useTranslation();
  return (
    <StyledWrapper>
      {heading && (
        <StyledHeading element="h2" margin="small" headingStyle="list-title" data-inverted={inverted}>
          {heading}
        </StyledHeading>
      )}
      <StyledList data-testid="nav-box-list" data-direction={listDirection}>
        {items?.map((item) => (
          <StyledListItem key={item.label} data-testid="nav-box-item">
            <StyledListElementWrapper
              data-additional={item.isAdditionalResource}
              data-color-mode={colorMode}
              data-selected={item.selected}
            >
              <StyledSafeLinkButton
                to={item.url ?? ""}
                colorTheme={item.selected ? "darker" : colorMode}
                size="medium"
                shape="sharp"
              >
                <StyledButtonContentText>
                  <StyledMarksWrapper>
                    {item.isAdditionalResource && (
                      <Additional aria-label={t("resource.additionalTooltip")} aria-hidden={false} />
                    )}
                    {item.isRestrictedResource && <HumanMaleBoard />}
                  </StyledMarksWrapper>
                  <StyledSpan>{item.label}</StyledSpan>
                </StyledButtonContentText>
                {item.selected && <StyledButtonContentSelected />}
              </StyledSafeLinkButton>
            </StyledListElementWrapper>
          </StyledListItem>
        ))}
      </StyledList>
    </StyledWrapper>
  );
};

export default NavigationBox;
