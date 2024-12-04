/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ArrowLeftLine, HomeFill } from "@ndla/icons";
import { Button } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";

interface Props {
  onGoBack: () => void;
  title: string;
  homeButton?: boolean;
}

const StyledButton = styled(Button, {
  base: {
    display: "flex",
    gap: "small",
    justifyContent: "flex-start",
    tablet: {
      display: "none",
    },
  },
});

const BackButton = ({ onGoBack, title, homeButton }: Props) => {
  const Icon = homeButton ? HomeFill : ArrowLeftLine;
  return (
    <StyledButton onClick={onGoBack} variant="secondary">
      <Icon />
      {title}
    </StyledButton>
  );
};

export default BackButton;
