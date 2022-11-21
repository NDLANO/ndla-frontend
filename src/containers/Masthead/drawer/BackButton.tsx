/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { ButtonV2 } from '@ndla/button';
import { breakpoints, colors, mq, spacing } from '@ndla/core';
import { Home } from '@ndla/icons/action';
import { Back } from '@ndla/icons/common';

interface Props {
  onGoBack: () => void;
  title: string;
  homeButton?: boolean;
}

const StyledButton = styled(ButtonV2)`
  display: flex;
  gap: ${spacing.small};
  border-bottom: 1px solid ${colors.brand.neutral7};
  color: ${colors.brand.primary};
  justify-content: flex-start;
  padding: ${spacing.small} ${spacing.normal};
  ${mq.range({ from: breakpoints.mobileWide })} {
    display: none;
  }
`;

const BackButton = ({ onGoBack, title, homeButton }: Props) => {
  const Icon = homeButton ? Home : Back;
  return (
    <StyledButton onClick={onGoBack} variant="ghost">
      <Icon />
      {title}
    </StyledButton>
  );
};

export default BackButton;
