/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { breakpoints, fonts, mq } from "@ndla/core";
import { SafeLink, SafeLinkButton } from "@ndla/safelink";

const buttonCss = css`
  display: flex;
  justify-content: flex-start;
  white-space: nowrap;
  ${mq.range({ until: breakpoints.tablet })} {
    font-weight: ${fonts.weight.normal};
  }
`;
// TODO: Update when SafeLinkButton using new button component is implemented
export const StyledSafeLinkButton = styled(SafeLinkButton)`
  ${buttonCss};
`;
// TODO: Delete when SettingsMenu is updated
export const StyledButton = styled(ButtonV2)`
  ${buttonCss};
`;

export const StyledSafeLink = styled(SafeLink)`
  ${buttonCss};
`;
