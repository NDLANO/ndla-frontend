/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { breakpoints, mq, spacing, spacingUnit } from '@ndla/core';
import { HTMLAttributes, ReactNode } from 'react';
import { MY_NDLA_CONTENT_WIDTH } from '../../../constants';
import { ViewType } from '../Folders/FoldersPage';
import Toolbar from './Toolbar';

const ContentWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 ${spacing.nsmall} ${spacingUnit * 3}px ${spacing.nsmall};

  ${mq.range({ from: breakpoints.tablet })} {
    margin: 0 ${spacing.large} ${spacingUnit * 3}px ${spacing.large};
  }
`;

export const Content = styled.div`
  max-width: ${MY_NDLA_CONTENT_WIDTH}px;
  width: 100%;
`;

interface Props extends HTMLAttributes<HTMLDivElement> {
  dropDownMenu?: ReactNode;
  buttons?: ReactNode;
  viewType?: ViewType;
  onViewTypeChange?: (val: ViewType) => void;
  extendTabletView?: boolean;
}

const MyNdlaPageWrapper = ({
  buttons,
  dropDownMenu,
  onViewTypeChange,
  viewType,
  extendTabletView,
  children,
}: Props) => {
  return (
    <>
      <Toolbar
        buttons={buttons}
        dropDownMenu={dropDownMenu}
        onViewTypeChange={onViewTypeChange}
        viewType={viewType}
        extendTabletView={extendTabletView}
      />
      <ContentWrapper>
        <Content>{children}</Content>
      </ContentWrapper>
    </>
  );
};

export default MyNdlaPageWrapper;
