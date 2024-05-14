/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { CSSProperties, ComponentProps, useMemo } from "react";
import styled from "@emotion/styled";
import { breakpoints, mq } from "@ndla/core";

const StyledBanner = styled.div`
  width: 100%;
  height: 120px;
  margin-top: 0px;
  background-image: var(--banner-image);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center right;
  ${mq.range({ from: breakpoints.tablet })} {
    height: 190px;
  }
  ${mq.range({ from: breakpoints.desktop })} {
    height: 220px;
  }
`;

interface Props extends ComponentProps<"div"> {
  image: string;
}

const SubjectBanner = ({ image, ...rest }: Props) => {
  const variables = useMemo(() => ({ "--banner-image": `url(${image})` }) as CSSProperties, [image]);
  return <StyledBanner style={variables} {...rest} />;
};

export default SubjectBanner;
