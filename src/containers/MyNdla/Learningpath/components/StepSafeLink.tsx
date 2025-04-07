/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";

export const StepSafeLink = styled(SafeLink, {
  base: {
    display: "inline",
    color: "text.default",
    textDecoration: "underline",
    _hover: {
      textDecoration: "none",
    },
    _focusVisible: {
      textDecoration: "none",
    },
  },
});
