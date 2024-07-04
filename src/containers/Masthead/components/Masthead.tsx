/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from "react";
import styled from "@emotion/styled";
import { breakpoints, colors, fonts, misc, mq, spacing, stackOrder } from "@ndla/core";
import { MessageBanner } from "@ndla/ui";
import SkipToMainContent from "./SkipToMainContent";

const MastheadContent = styled.div`
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: ${spacing.small} ${spacing.normal};
  font-weight: ${fonts.weight.normal};
  display: flex;
  width: 100%;
  height: ${misc.mastheadHeight};
  justify-content: space-between;
  gap: ${spacing.xsmall};
  ${mq.range({ until: breakpoints.tablet })} {
    padding: ${spacing.small};
    gap: ${spacing.xsmall};
  }
`;

const StyledMasthead = styled.div`
  z-index: ${stackOrder.banner};
  position: relative;
  background: ${colors.white};
  border-bottom: 1px solid ${colors.brand.greyLighter};
  min-height: ${misc.mastheadHeight};
  display: flex;
  flex-flow: column;
  justify-content: flex-end;

  &[data-fixed="true"] {
    top: 0;
    position: sticky;
    @media print {
      position: relative;
    }
  }
`;

interface Alert {
  content: ReactNode;
  closable?: boolean;
  number: number;
}

interface Props {
  children?: ReactNode;
  fixed?: boolean;
  skipToMainContentId?: string;
  messages?: Alert[];
  onCloseAlert?: (id: number) => void;
}

export const Masthead = ({ children, fixed, skipToMainContentId, messages, onCloseAlert }: Props) => {
  return (
    <>
      {skipToMainContentId && <SkipToMainContent skipToMainContentId={skipToMainContentId} />}
      <StyledMasthead data-fixed={!!fixed} id="masthead">
        {messages?.map((message) => (
          <MessageBanner
            key={message.number}
            showCloseButton={message.closable}
            onClose={() => onCloseAlert?.(message.number)}
          >
            {message.content}
          </MessageBanner>
        ))}
        <MastheadContent>{children}</MastheadContent>
      </StyledMasthead>
    </>
  );
};

export default Masthead;
