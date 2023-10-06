/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { colors, fonts, spacing } from '@ndla/core';
import Icon from '@ndla/icons';
import { Heading } from '@ndla/typography';
import { ReactNode } from 'react';

interface Props {
  icon: ReactNode;
  title: string;
  children?: ReactNode;
}

const InfoPartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
`;

const InfoPartHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${spacing.nsmall};
`;

const StyledTitle = styled(Heading)`
  ${fonts.sizes('22px', '33px')}
`;

export const InfoPartText = styled.p`
  margin: 0;
`;

export const InfoPartIcon = styled(Icon)`
  width: 30px;
  height: 30px;
`;

const InfoPart = ({ icon, title, children }: Props) => {
  return (
    <InfoPartWrapper>
      <InfoPartHeader>
        {icon}
        <StyledTitle
          element="h2"
          id="myProfileTitle"
          margin="none"
          headingStyle="default"
        >
          {title}
        </StyledTitle>
      </InfoPartHeader>
      {children}
    </InfoPartWrapper>
  );
};

export default InfoPart;
