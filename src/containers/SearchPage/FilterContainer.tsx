/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { styled } from "@ndla/styled-system/jsx";

export const FilterContainer = styled("div", {
  base: {
    border: "1px solid",
    borderColor: "stroke.subtle",
    borderRadius: "xsmall",
    padding: "xsmall",
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
  },
});
