/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { colors, spacing, misc } from "@ndla/core";
import { LockFill } from "@ndla/icons/common";
import { SafeLink } from "@ndla/safelink";
import { Text } from "@ndla/typography";
import { routes } from "../../../../routeHelpers";
import { formatDateTime } from "../../../../util/formatDate";

interface Props {
  id: number;
  title: string;
  timestamp: string;
  count: number;
  locked?: boolean;
}
const StyledSafelink = styled(SafeLink)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${spacing.normal};
  padding: ${spacing.normal} ${spacing.medium};
  padding-left: ${spacing.large};
  border: 1px solid ${colors.brand.light};
  border-radius: ${misc.borderRadius};
  box-shadow: none;
  background-color: ${colors.background.lightBlue};
  &:hover,
  &:focus-visible {
    background-color: ${colors.brand.lighter};
    [data-name="hover"] {
      text-decoration: none;
    }
  }
`;

const StyledHeader = styled(Text)`
  color: ${colors.brand.primary};
  text-decoration: underline;
  overflow-wrap: break-word;
  cursor: pointer;
`;

const StyledText = styled(Text)`
  color: ${colors.text.primary};
  padding-top: ${spacing.xsmall};
`;

const StyledCountContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${colors.text.primary};
`;

const StyledLockedIcon = styled(LockFill)`
  width: ${spacing.normal};
  height: ${spacing.normal};
  color: ${colors.brand.primary};
`;

const CountContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TopicCard = ({ id, title, locked, timestamp, count }: Props) => {
  const { t, i18n } = useTranslation();
  return (
    <StyledSafelink to={routes.myNdla.arenaTopic(id)}>
      <div>
        <StyledHeader element="label" textStyle="label-small" margin="none" data-name="hover">
          {title}
        </StyledHeader>
        <StyledText element="p" textStyle="meta-text-small" margin="none">
          {timestamp && formatDateTime(timestamp, i18n.language)}
        </StyledText>
      </div>
      <StyledCountContainer>
        {locked ? (
          <StyledLockedIcon />
        ) : (
          <CountContainer aria-label={`${count} ${t("myNdla.arena.topic.responses")}`}>
            <Text element="p" textStyle="content-alt" margin="none" aria-hidden>
              {count}
            </Text>
            <StyledText textStyle="meta-text-small" margin="none" aria-hidden>
              {t("myNdla.arena.topic.responses")}
            </StyledText>
          </CountContainer>
        )}
      </StyledCountContainer>
    </StyledSafelink>
  );
};

export default TopicCard;
