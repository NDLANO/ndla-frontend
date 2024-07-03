/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from "@emotion/styled";
import { breakpoints, colors, mq, spacing } from "@ndla/core";

export const MediaListRef = styled.div`
  background: ${colors.white};
  width: 100%;
  ${mq.range({ until: breakpoints.tablet })} {
    button,
    a {
      width: 100%;
      margin: ${spacing.xxsmall} 0;
    }
  }
`;
