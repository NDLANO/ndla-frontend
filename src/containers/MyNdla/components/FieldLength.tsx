/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";

interface FieldLengthProps {
  value: number;
  maxLength: number;
}

const StyledText = styled(Text, {
  base: {
    textAlign: "right",
  },
});

// TODO Update component to be more UU friendly
const FieldLength = ({ value, maxLength }: FieldLengthProps) => {
  return (
    <StyledText textStyle="label.small" asChild consumeCss>
      <span>{`${value}/${maxLength}`}</span>
    </StyledText>
  );
};

export default FieldLength;
