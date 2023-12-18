/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { IconButtonV2 } from '@ndla/button';
import { breakpoints, mq, spacing } from '@ndla/core';
import { LearningPathQuiz } from '@ndla/icons/contentType';
import {
  ModalBody,
  ModalHeader,
  ModalCloseButton,
  Modal,
  ModalTrigger,
  ModalContent,
} from '@ndla/modal';
import { Switch } from '@ndla/switch';
import { Heading, Text } from '@ndla/typography';
import { HeadingType } from '../../interfaces';

const switchCSS = css`
  margin-right: ${spacing.xsmall};
`;

const invertedSwitchCSS = css`
  margin-right: ${spacing.xsmall};
  color: #fff;
`;

const TopicTitleWrapper = styled.header`
  display: flex;
  align-items: center;
  margin-top: ${spacing.large};
  padding-bottom: ${spacing.small};
  justify-content: space-between;
  ${mq.range({ until: breakpoints.mobileWide })} {
    align-items: flex-start;
    flex-direction: column;
    gap: ${spacing.small};
  }
`;

const invertedTopicTitleWrapperStyle = css`
  color: #fff;
`;

const StyledRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.xsmall};
`;

const StyledHGroup = styled.hgroup`
  display: flex;
  gap: ${spacing.small};
  align-items: center;
`;

interface Props {
  title?: string;
  subTitle?: string;
  heading: HeadingType;
  toggleAdditionalResources: () => void;
  hasAdditionalResources: boolean;
  showAdditionalResources: boolean;
  invertedStyle?: boolean;
}
const ResourcesTopicTitle = ({
  title,
  subTitle,
  hasAdditionalResources,
  toggleAdditionalResources,
  showAdditionalResources,
  heading,
  invertedStyle = false,
}: Props) => {
  const { t } = useTranslation();

  const tooltipId = 'popupDialogTooltip';

  return (
    <TopicTitleWrapper
      css={invertedStyle ? invertedTopicTitleWrapperStyle : undefined}
    >
      <StyledHGroup>
        <Heading element={heading} headingStyle="list-title" margin="none">
          {title}
        </Heading>
        <Text textStyle="content-alt" margin="none">
          {subTitle}
        </Text>
      </StyledHGroup>
      {hasAdditionalResources && (
        <StyledRow>
          <form>
            <Switch
              id="toggleAdditionID"
              checked={showAdditionalResources}
              label={t('resource.activateAdditionalResources')}
              onChange={toggleAdditionalResources}
              css={invertedStyle ? invertedSwitchCSS : switchCSS}
            />
          </form>
          <Modal aria-labelledby={tooltipId}>
            <ModalTrigger>
              <IconButtonV2
                colorTheme="light"
                inverted={invertedStyle}
                id={tooltipId}
                aria-label={t('resource.dialogTooltip')}
                title={t('resource.dialogTooltip')}
              >
                <LearningPathQuiz />
              </IconButtonV2>
            </ModalTrigger>
            <ModalContent>
              <ModalHeader>
                <h1>{t('resource.dialogHeading')}</h1>
                <ModalCloseButton title={t('modal.closeModal')} />
              </ModalHeader>
              <ModalBody>
                <hr />
                <p>{t('resource.dialogText1')}</p>
                <p>{t('resource.dialogText2')}</p>
              </ModalBody>
            </ModalContent>
          </Modal>
        </StyledRow>
      )}
    </TopicTitleWrapper>
  );
};

export default ResourcesTopicTitle;
