/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { spacingUnit } from '@ndla/core';
import { HTMLAttributes, ReactNode } from 'react';
import { MY_NDLA_CONTENT_WIDTH } from '../../../constants';
import { ViewType } from '../Folders/FoldersPage';
import Toolbar from './Toolbar';

const ContentWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding-bottom: ${spacingUnit * 6};
`;

export const Content = styled.div`
  max-width: ${MY_NDLA_CONTENT_WIDTH}px;
  width: 100%;
`;

interface Props extends HTMLAttributes<HTMLDivElement> {
  showToolbar?: boolean;
  dropDownMenu?: ReactNode;
  buttons?: ReactNode[];
  viewType?: ViewType;
  onViewTypeChange?: (val: ViewType) => void;
}

const MyNdlaPageWrapper = ({
  showToolbar = true,
  buttons,
  dropDownMenu,
  onViewTypeChange,
  viewType,
  children,
}: Props) => {
  return (
    <>
      {showToolbar && (
        <Toolbar
          buttons={buttons}
          dropDownMenu={dropDownMenu}
          onViewTypeChange={onViewTypeChange}
          viewType={viewType}
        />
      )}
      <ContentWrapper>
        <Content>{children}</Content>
      </ContentWrapper>
    </>
  );
};

export default MyNdlaPageWrapper;
