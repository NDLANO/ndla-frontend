/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { RainbowSpinner } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { useTranslation } from "react-i18next";

const SpinnerWrapper = styled("div", {
  base: {
    paddingBlockStart: "4xlarge",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export const PageRainbowSpinner = () => {
  const { t } = useTranslation();
  return (
    <SpinnerWrapper>
      <RainbowSpinner aria-label={t("loading")} />
    </SpinnerWrapper>
  );
};
