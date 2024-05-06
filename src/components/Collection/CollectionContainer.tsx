/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { CSSProperties, ReactNode, useMemo } from "react";
import styled from "@emotion/styled";
import { breakpoints, colors, mq, spacing } from "@ndla/core";

interface Props {
  children: ReactNode;
  imageUrl: string;
}

const StyledBackground = styled.div`
  width: 100%;
  margin: 0 auto;
  background-image: var(--programme-image);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 400px;

  ${mq.range({ until: breakpoints.tablet })} {
    height: 160px;
    margin: ${spacing.normal} ${spacing.normal} 0;
    width: calc(100% - ${spacing.medium});
  }
  ${mq.range({ until: breakpoints.mobileWide })} {
    height: 128px;
  }
`;

const StyledOneColumn = styled.div`
  display: flex;
  flex-direction: column;
  background: ${colors.white};
  width: 90%;
  margin-top: -170px;
  padding: 1px ${spacing.large};
  ${mq.range({ until: breakpoints.tablet })} {
    width: 100%;
    margin: 0;
    padding: 1px ${spacing.normal};
  }
`;

const StyledMain = styled.main`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
`;

const ContentWrapper = styled.div`
  max-width: 1105px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CollectionContainer = ({ children, imageUrl }: Props) => {
  const style = useMemo(() => ({ "--programme-image": `url(${imageUrl}` }) as CSSProperties, [imageUrl]);

  return (
    <StyledMain>
      <ContentWrapper>
        <StyledBackground style={style} />
        <StyledOneColumn>{children}</StyledOneColumn>
      </ContentWrapper>
    </StyledMain>
  );
};

export default CollectionContainer;
