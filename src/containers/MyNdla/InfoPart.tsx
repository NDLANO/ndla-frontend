/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from 'react';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import Icon from '@ndla/icons';
import { Heading } from '@ndla/typography';

interface Props {
  icon?: ReactNode;
  title: string;
  children?: ReactNode;
}

const InfoPartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
  max-width: 700px;
`;

const InfoPartHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${spacing.nsmall};
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
        <Heading element="h2" id="myProfileTitle" margin="none" headingStyle="h2">
          {title}
        </Heading>
      </InfoPartHeader>
      {children}
    </InfoPartWrapper>
  );
};

export default InfoPart;
