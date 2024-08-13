/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { gql } from "@apollo/client";
import { Portal } from "@ark-ui/react";
import styled from "@emotion/styled";
import { animations, breakpoints, colors, mq, spacing, stackOrder } from "@ndla/core";
import { ArrowLeftLine, ArrowRightLine } from "@ndla/icons/common";
import { LearningPath } from "@ndla/icons/contentType";
import { Button, DialogBody, DialogContent, DialogHeader, DialogRoot, DialogTrigger } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { Text } from "@ndla/typography";
import { usePrevious } from "@ndla/util";
import {
  GQLLearningpathFooter_LearningpathFragment,
  GQLLearningpathFooter_LearningpathStepFragment,
} from "../../graphqlTypes";
import { toLearningPath } from "../../routeHelpers";
import { DialogCloseButton } from "../DialogCloseButton";

const StepInfoText = styled(Text)`
  white-space: nowrap;
  ${mq.range({ from: breakpoints.desktop })} {
    display: none;
  }
`;

const LinkText = styled.span`
  display: none;
  ${mq.range({ from: breakpoints.desktop })} {
    display: block;
  }
`;

const FooterWrapper = styled.div`
  display: flex;
  gap: ${spacing.small};
  margin-left: auto;
  justify-content: space-between;
  background: ${colors.brand.lighter};
  ${animations.fadeInBottom()}
  min-height: ${spacing.large};
  max-height: ${spacing.large};
  ${mq.range({ until: breakpoints.desktop })} {
    position: fixed;
    bottom: env(safe-area-inset-bottom);
    left: 0;
    right: 0;
    z-index: ${stackOrder.offsetDouble};
  }
`;

const LinksWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, ${spacing.large});
  align-items: center;
  justify-content: flex-end;
  ${mq.range({ from: breakpoints.desktop })} {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  a {
    break-inside: avoid;
  }
`;

const StyledSafeLink = styled(SafeLink)`
  display: flex;
  align-items: center;
  gap: ${spacing.small};
  color: ${colors.brand.primary};
  box-shadow: none;
  height: 100%;
  padding: ${spacing.small};
  text-decoration: underline;
  text-underline-offset: 5px;
  &:hover,
  &:focus-within {
    background: ${colors.brand.light};
    text-decoration: none;
  }
`;

interface Props {
  mobileView?: boolean;
  learningPathMenu: ReactNode;
  previousStep?: GQLLearningpathFooter_LearningpathStepFragment;
  nextStep?: GQLLearningpathFooter_LearningpathStepFragment;
  learningPath: GQLLearningpathFooter_LearningpathFragment;
  path?: string;
  totalSteps: number;
  currentStep: number;
}

const LearningpathFooter = ({
  mobileView,
  learningPathMenu,
  previousStep,
  nextStep,
  learningPath,
  path,
  totalSteps,
  currentStep,
}: Props) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const location = useLocation();
  const previousPath = usePrevious(location.pathname);

  useEffect(() => {
    if (!previousPath) return;
    setOpen(false);
  }, [previousPath]);

  return (
    <FooterWrapper>
      {mobileView && (
        <DialogRoot open={open} size="full" onOpenChange={(details) => setOpen(details.open)}>
          <DialogTrigger asChild>
            {/* TODO: Not sure if correct*/}
            <Button variant="secondary" size="small">
              <LearningPath />
              {t("learningPath.openMenuTooltip")}
            </Button>
          </DialogTrigger>
          <Portal>
            <DialogContent>
              <DialogHeader>
                {/* TODO: Add a dialog title if we're keeping this dialog. */}
                <div />
                <DialogCloseButton />
              </DialogHeader>
              <DialogBody>{learningPathMenu}</DialogBody>
            </DialogContent>
          </Portal>
        </DialogRoot>
      )}
      <LinksWrapper>
        {previousStep ? (
          <StyledSafeLink
            to={toLearningPath(learningPath.id, previousStep.id, path)}
            aria-label={t("learningPath.previousArrow")}
          >
            <ArrowLeftLine />
            <LinkText>{previousStep.title}</LinkText>
          </StyledSafeLink>
        ) : (
          <div />
        )}
        <StepInfoText textStyle="meta-text-small" margin="none">
          {t("learningPath.mobileStepInfo", { totalPages: totalSteps, currentPage: currentStep })}
        </StepInfoText>
        {nextStep ? (
          <StyledSafeLink
            to={toLearningPath(learningPath.id, nextStep.id, path)}
            aria-label={t("learningPath.nextArrow")}
          >
            <LinkText>{nextStep.title}</LinkText>
            <ArrowRightLine />
          </StyledSafeLink>
        ) : (
          <div />
        )}
      </LinksWrapper>
    </FooterWrapper>
  );
};

LearningpathFooter.fragments = {
  learningpathStep: gql`
    fragment LearningpathFooter_LearningpathStep on LearningpathStep {
      id
      title
    }
  `,
  learningpath: gql`
    fragment LearningpathFooter_Learningpath on Learningpath {
      id
    }
  `,
};

export default LearningpathFooter;
