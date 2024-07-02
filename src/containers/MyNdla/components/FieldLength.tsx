/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from "@emotion/styled";

interface FieldLengthProps {
  value: number;
  maxLength: number;
}

const StyledSpan = styled.span`
  display: block;
  text-align: right;
`;
// TODO Update component to be more UU friendly
const FieldLength = ({ value, maxLength }: FieldLengthProps) => {
  return <StyledSpan>{`${value}/${maxLength}`}</StyledSpan>;
};

export default FieldLength;
