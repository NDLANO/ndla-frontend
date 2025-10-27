/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Heading } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { SKIP_TO_CONTENT_ID } from "../../constants";

export const TitleWrapper = styled("div", {
  base: {
    alignItems: "flex-start",
    display: "flex",
    flexDirection: "column",
    gap: "medium",
    "& a": {
      color: "text.default",
    },
  },
});

interface Props {
  title: string;
}

export const MyNdlaTitle = ({ title }: Props) => {
  return (
    <Heading textStyle="heading.medium" id={SKIP_TO_CONTENT_ID}>
      {title}
    </Heading>
  );
};
