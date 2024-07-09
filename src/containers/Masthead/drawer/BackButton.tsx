/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Back, Home } from "@ndla/icons/common";
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
    borderBottom: "1px solid gray",
    justifyContent: "flex-start",
    padding: "small normal",
    tablet: {
      display: "none",
    },
  },
});

const BackButton = ({ onGoBack, title, homeButton }: Props) => {
  const Icon = homeButton ? Home : Back;
  return (
    <StyledButton onClick={onGoBack} variant="secondary">
      <Icon />
      {title}
    </StyledButton>
  );
};

export default BackButton;
