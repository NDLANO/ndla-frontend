/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { IconButtonV2 } from "@ndla/button";
import { breakpoints, colors, misc, mq, spacing } from "@ndla/core";
import { LearningPathQuiz } from "@ndla/icons/contentType";
import { ModalBody, ModalHeader, ModalCloseButton, Modal, ModalTrigger, ModalContent, ModalTitle } from "@ndla/modal";
import { Switch } from "@ndla/switch";
import { Heading, Text } from "@ndla/typography";
import { HeadingType } from "../../interfaces";

const TopicTitleWrapper = styled.header`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-top: ${spacing.large};
  padding-bottom: ${spacing.small};
  justify-content: space-between;
  ${mq.range({ until: breakpoints.mobileWide })} {
    align-items: flex-start;
    flex-direction: column;
    gap: ${spacing.small};
  }
  &[data-inverted="true"] {
    color: ${colors.white};
  }
`;

const StyledModalHeader = styled(ModalHeader)`
  padding-bottom: 0;
`;

const StyledRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.xsmall};
`;

const StyledSwitch = styled(Switch)`
  border: 2px solid transparent;
  border-radius: ${misc.borderRadius};
  margin-right: ${spacing.xsmall};
  &:focus,
  &:focus-visible,
  &:focus-within {
    border-color: ${colors.brand.dark};
  }
  // Props are forwarded weirdly, so we need to use :has
  &[data-inverted="true"],
  &:has([data-inverted="true"]) {
    color: ${colors.white};
  }
`;

const StyledHGroup = styled.hgroup`
  display: flex;
  gap: ${spacing.small};
  flex-wrap: wrap;
  align-items: center;
`;

interface Props {
  headingId: string;
  title?: string;
  subTitle?: string;
  heading: HeadingType;
  toggleAdditionalResources: () => void;
  hasAdditionalResources: boolean;
  showAdditionalResources: boolean;
  invertedStyle?: boolean;
}
const ResourcesTopicTitle = ({
  headingId,
  title,
  subTitle,
  hasAdditionalResources,
  toggleAdditionalResources,
  showAdditionalResources,
  heading,
  invertedStyle = false,
}: Props) => {
  const { t } = useTranslation();

  return (
    <TopicTitleWrapper data-inverted={invertedStyle}>
      <StyledHGroup>
        <Heading id={headingId} element={heading} headingStyle="list-title" margin="none">
          {title}
        </Heading>
        <Text textStyle="content-alt" margin="none">
          {subTitle}
        </Text>
      </StyledHGroup>
      {hasAdditionalResources && (
        <StyledRow>
          <form>
            <StyledSwitch
              id="toggleAdditionID"
              checked={showAdditionalResources}
              label={t("resource.activateAdditionalResources")}
              onChange={toggleAdditionalResources}
              data-inverted={invertedStyle}
            />
          </form>
          <Modal>
            <ModalTrigger>
              <IconButtonV2
                colorTheme="light"
                inverted={invertedStyle}
                aria-label={t("resource.dialogTooltip")}
                title={t("resource.dialogTooltip")}
              >
                <LearningPathQuiz />
              </IconButtonV2>
            </ModalTrigger>
            <ModalContent>
              <StyledModalHeader>
                <ModalTitle>{t("resource.dialogHeading")}</ModalTitle>
                <ModalCloseButton title={t("modal.closeModal")} />
              </StyledModalHeader>
              <ModalBody>
                <hr />
                <p>{t("resource.dialogText1")}</p>
                <p>{t("resource.dialogText2")}</p>
              </ModalBody>
            </ModalContent>
          </Modal>
        </StyledRow>
      )}
    </TopicTitleWrapper>
  );
};

export default ResourcesTopicTitle;
