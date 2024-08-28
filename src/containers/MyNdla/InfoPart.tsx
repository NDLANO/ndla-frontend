/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from "react";
import { Heading } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";

interface Props {
  icon?: ReactNode;
  title: string;
  children?: ReactNode;
}

const InfoPartWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
    maxWidth: "surface.xlarge",
  },
});

const InfoPartHeader = styled("div", {
  base: {
    alignItems: "center",
    display: "flex",
    gap: "xxsmall",
  },
});

const InfoPart = ({ icon, title, children }: Props) => {
  return (
    <InfoPartWrapper>
      <InfoPartHeader>
        {icon}
        <Heading id="myProfileTitle" textStyle="heading.small" asChild consumeCss>
          <h2>{title}</h2>
        </Heading>
      </InfoPartHeader>
      {children}
    </InfoPartWrapper>
  );
};

export default InfoPart;
