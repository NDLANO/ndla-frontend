/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { type RefObject } from "react";
import { useTranslation } from "react-i18next";
import { Spinner, SpinnerProps } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";

const SpinnerWrapper = styled("div", {
  base: {
    paddingBlockStart: "4xlarge",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

interface Props extends SpinnerProps {
  ref?: RefObject<HTMLDivElement>;
}

export const PageSpinner = ({ ref, ...rest }: Props) => {
  const { t } = useTranslation();
  return (
    <SpinnerWrapper>
      <Spinner {...rest} aria-label={t("loading")} ref={ref} />
    </SpinnerWrapper>
  );
};
