/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { HTMLAttributes, ReactNode } from 'react';
import styled from '@emotion/styled';
import { breakpoints, mq, spacing } from '@ndla/core';
import Toolbar from './Toolbar';
import { MY_NDLA_CONTENT_WIDTH } from '../../../constants';
import { ViewType } from '../Folders/FoldersPage';

const ContentWrapper = styled.main`
  display: flex;
  justify-content: center;
  margin: ${spacing.nsmall} ${spacing.nsmall} ${spacingUnit * 3}px;

  ${mq.range({ from: breakpoints.tablet })} {
    margin: 0 ${spacing.large} ${spacingUnit * 3}px;
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
  showButtons?: boolean;
}

const MyNdlaPageWrapper = ({
  buttons,
  dropDownMenu,
  onViewTypeChange,
  viewType,
  showButtons,
  children,
}: Props) => {
  return (
    <>
      <Toolbar
        buttons={buttons}
        dropDownMenu={dropDownMenu}
        onViewTypeChange={onViewTypeChange}
        viewType={viewType}
        showButtons={showButtons}
      />
      <ContentWrapper>
        <Content>{children}</Content>
      </ContentWrapper>
    </>
  );
};

export default MyNdlaPageWrapper;
