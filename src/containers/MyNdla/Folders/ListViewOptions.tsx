/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import Tooltip from '@ndla/tooltip';
import { IconButtonV2 } from '@ndla/button';
import { breakpoints, colors, mq, spacing } from '@ndla/core';
import { FourlineHamburger, GridListView, List } from '@ndla/icons/action';
import { ViewType } from './FoldersPage';

const StyledDisplayOptionsContainer = styled.div`
  display: flex;
  margin-left: auto;
`;

const hiddenOnMobileStyle = css`
  ${mq.range({ until: breakpoints.mobileWide })} {
    display: none;
  }
`;

interface StyledIconButtonProps {
  selected?: boolean;
}

const StyledIconButton = styled(IconButtonV2)<StyledIconButtonProps>`
  padding: ${spacing.xsmall};
  margin: 0 ${spacing.xxsmall};
  svg {
    margin: 0;
    width: 24px;
    height: 24px;
    fill: ${p => (p.selected ? colors.brand.primary : colors.brand.tertiary)};
  }
  :focus {
    background-color: transparent;
  }
  :focus,
  :hover,
  :active {
    svg {
      fill: ${colors.brand.primary};
    }
  }
`;

interface Props {
  onTypeChange: (type: ViewType) => void;
  type: ViewType;
}

const ListViewOptions = ({ onTypeChange, type }: Props) => {
  const { t } = useTranslation();
  return (
    <StyledDisplayOptionsContainer>
      <Tooltip tooltip={t('myNdla.listView')}>
        <StyledIconButton
          selected={type === 'list'}
          variant="ghost"
          colorTheme="light"
          onClick={() => onTypeChange('list')}
          size="small"
          aria-label={t('myNdla.listView')}>
          <FourlineHamburger />
        </StyledIconButton>
      </Tooltip>
      <Tooltip tooltip={t('myNdla.detailView')}>
        <StyledIconButton
          selected={type === 'listLarger'}
          variant="ghost"
          colorTheme="light"
          onClick={() => onTypeChange('listLarger')}
          size="small"
          aria-label={t('myNdla.detailView')}>
          <List />
        </StyledIconButton>
      </Tooltip>
      <Tooltip tooltip={t('myNdla.shortView')} css={hiddenOnMobileStyle}>
        <StyledIconButton
          selected={type === 'block'}
          variant="ghost"
          colorTheme="light"
          onClick={() => onTypeChange('block')}
          size="small"
          aria-label={t('myNdla.shortView')}>
          <GridListView />
        </StyledIconButton>
      </Tooltip>
    </StyledDisplayOptionsContainer>
  );
};

export default memo(ListViewOptions, (prev, curr) => prev.type === curr.type);
