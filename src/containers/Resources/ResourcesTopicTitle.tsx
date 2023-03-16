import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { breakpoints, fonts, mq, spacing } from '@ndla/core';
import { ModalBody, ModalHeader, ModalCloseButton, ModalV2 } from '@ndla/modal';
import Tooltip from '@ndla/tooltip';
import { Switch } from '@ndla/switch';
import { LearningPathQuiz } from '@ndla/icons/contentType';
import { IconButtonV2 } from '@ndla/button';
import { HeadingType } from '../../interfaces';

const switchCSS = css`
  margin-right: ${spacing.xsmall};
`;

const invertedSwitchCSS = css`
  margin-right: ${spacing.xsmall};
  color: #fff;
`;

const headingStyle = css`
  ${fonts.sizes('20px', '26px')};
  font-weight: ${fonts.weight.bold};
  margin: 0;
  text-transform: uppercase;
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

const StyledParagraph = styled.p`
  margin: 0;
  padding: 0;
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
  heading: Heading,
  invertedStyle = false,
}: Props) => {
  const { t } = useTranslation();

  const tooltipId = 'popupDialogTooltip';

  return (
    <TopicTitleWrapper
      css={invertedStyle ? invertedTopicTitleWrapperStyle : undefined}
    >
      <StyledHGroup>
        <Heading css={headingStyle}>{title}</Heading>
        <StyledParagraph>{subTitle}</StyledParagraph>
      </StyledHGroup>
      {hasAdditionalResources && (
        <StyledRow>
          <Switch
            id="toggleAdditionID"
            checked={showAdditionalResources}
            label={t('resource.activateAdditionalResources')}
            onChange={toggleAdditionalResources}
            css={invertedStyle ? invertedSwitchCSS : switchCSS}
          />
          <ModalV2
            labelledBy={tooltipId}
            wrapperFunctionForButton={(activateButton: ReactNode) => (
              <Tooltip tooltip={t('resource.dialogTooltip')}>
                {activateButton}
              </Tooltip>
            )}
            activateButton={
              <IconButtonV2
                colorTheme="light"
                inverted={invertedStyle}
                id={tooltipId}
                aria-label={t('resource.dialogTooltip')}
              >
                <LearningPathQuiz />
              </IconButtonV2>
            }
          >
            {(onClose: () => void) => (
              <>
                <ModalHeader>
                  <h1>{t('resource.dialogHeading')}</h1>
                  <ModalCloseButton
                    title={t('modal.closeModal')}
                    onClick={onClose}
                  />
                </ModalHeader>
                <ModalBody>
                  <hr />
                  <p>{t('resource.dialogText1')}</p>
                  <p>{t('resource.dialogText2')}</p>
                </ModalBody>
              </>
            )}
          </ModalV2>
        </StyledRow>
      )}
    </TopicTitleWrapper>
  );
};

export default ResourcesTopicTitle;
