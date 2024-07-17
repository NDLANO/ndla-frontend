/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { NdlaLogoText, Text } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";

const Wrapper = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    gap: "xsmall",
    justifyContent: "flex-end",
  },
});

const StyledText = styled(Text, {
  base: {
    "& a": {
      color: "inherit",
    },
  },
});

interface Props {
  name: string;
  description: string;
  url?: string;
  target?: string;
}

export const CreatedBy = ({ name, description, url, target = "_blank" }: Props) => (
  <Wrapper>
    <StyledText color="text.subtle" textStyle="body.large">
      {url ? (
        <SafeLink to={url} target={target}>
          {name}
        </SafeLink>
      ) : (
        name
      )}
      &nbsp;{description}&nbsp;
      <SafeLink to="https://ndla.no" target={target}>
        NDLA
      </SafeLink>
    </StyledText>
    <SafeLink to="https://ndla.no" aria-label="NDLA">
      <NdlaLogoText />
    </SafeLink>
  </Wrapper>
);
