/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ButtonV2 } from '@ndla/button';
import { FourlineHamburger, List } from '@ndla/icons/action';
import Tooltip from '@ndla/tooltip';
import styled from '@emotion/styled';
import { colors, spacing } from '@ndla/core';
import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import SettingsMenu, { MenuItemProps } from './SettingsMenu';
import { ViewType } from '../Folders/FoldersPage';

interface Props {
  menuItems: MenuItemProps[];
  viewType: ViewType;
  onViewTypeChange: (type: ViewType) => void;
}

const ViewButtonWrapper = styled.div`
  display: flex;
  gap: ${spacing.small};
  div,
  button {
    display: flex;
    flex: 1;
  }
`;

const ViewTypeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xsmall};
  padding: ${spacing.small};
  border-bottom: 1px solid ${colors.brand.neutral7};
  border-top: 1px solid ${colors.brand.neutral7};
  span {
    color: ${colors.brand.primary};
  }
`;

const ViewButton = styled(ButtonV2)`
  background-color: transparent;
  color: ${colors.brand.primary};
  svg {
    width: 40px;
    height: 40px;
  }
  &[aria-current='true'] {
    background-color: ${colors.brand.lightest};
  }
  &[aria-current='false'] {
    color: ${colors.brand.light};
    border-color: ${colors.brand.light};
  }
`;

const FolderMenu = ({ menuItems, viewType, onViewTypeChange }: Props) => {
  const { t } = useTranslation();

  const onListClick = useCallback(() => {
    return onViewTypeChange?.('list');
  }, [onViewTypeChange]);

  const onListLargerClick = useCallback(() => {
    return onViewTypeChange?.('listLarger');
  }, [onViewTypeChange]);

  return (
    <SettingsMenu menuItems={menuItems}>
      <ViewTypeWrapper>
        <span>{t('myNdla.selectView')}</span>
        <ViewButtonWrapper>
          <Tooltip tooltip={t('myNdla.listView')}>
            <ViewButton
              size="large"
              aria-current={viewType === 'list'}
              colorTheme="primary"
              onClick={onListClick}
            >
              <FourlineHamburger />
            </ViewButton>
          </Tooltip>
          <Tooltip tooltip={t('myNdla.detailView')}>
            <ViewButton
              size="large"
              aria-current={viewType === 'listLarger'}
              colorTheme="primary"
              onClick={onListLargerClick}
            >
              <List />
            </ViewButton>
          </Tooltip>
        </ViewButtonWrapper>
      </ViewTypeWrapper>
    </SettingsMenu>
  );
};

export default FolderMenu;
