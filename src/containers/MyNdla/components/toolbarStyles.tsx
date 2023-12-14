/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { css } from '@emotion/react';
import { breakpoints, fonts, mq } from '@ndla/core';

export const tbButtonCss = css`
  display: flex;
  justify-content: flex-start;
  white-space: nowrap;

  ${mq.range({ until: breakpoints.tablet })} {
    font-weight: ${fonts.weight.normal};
  }
`;
