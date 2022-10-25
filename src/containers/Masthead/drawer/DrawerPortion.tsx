/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { HTMLProps } from 'react';
import styled from '@emotion/styled';

interface Props extends HTMLProps<HTMLDivElement> {}

const StyledDiv = styled.div`
  max-width: 300px;
`;
const DrawerPortion = ({ children, ...rest }: Props) => {
  return <StyledDiv {...rest}>{children}</StyledDiv>;
};

export default DrawerPortion;
