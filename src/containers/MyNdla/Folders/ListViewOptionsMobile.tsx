/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { IconButtonV2 } from '@ndla/button';
import { spacing, colors } from '@ndla/core';
import { FourlineHamburger, List } from '@ndla/icons/action';
import { Text } from '@ndla/typography';
import { ViewType } from './FoldersPage';

const ViewButtonWrapper = styled.div`
  display: flex;
  gap: ${spacing.xxsmall};
  padding-left: ${spacing.small};
`;

const ViewButton = styled(IconButtonV2)`
  display: flex;
  flex-direction: column;

  background-color: transparent;
  color: ${colors.brand.primary};
  border-radius: ${spacing.xxsmall};
  border-color: ${colors.brand.light};

  &[aria-current='true'] {
    background-color: ${colors.brand.lightest};
  }
`;

interface FolderViewTypeProps {
  viewType: ViewType;
  setViewType: (val: ViewType) => void;
}

const FolderViewType = ({ viewType, setViewType }: FolderViewTypeProps) => {
  const { t } = useTranslation();
  return (
    <ViewButtonWrapper>
      <ViewButton
        aria-label={t('myNdla.listView')}
        aria-current={viewType === 'list'}
        onClick={() => setViewType('list')}
      >
        <FourlineHamburger />
        <Text textStyle="meta-text-xxsmall" margin="none">
          {t('myNdla.simpleList')}
        </Text>
      </ViewButton>
      <ViewButton
        aria-label={t('myNdla.detailView')}
        aria-current={viewType === 'listLarger'}
        onClick={() => setViewType('listLarger')}
      >
        <List />
        <Text textStyle="meta-text-xxsmall" margin="none">
          {t('myNdla.detailedList')}
        </Text>
      </ViewButton>
    </ViewButtonWrapper>
  );
};

export default memo(
  FolderViewType,
  (prev, next) => prev.viewType !== next.viewType,
);
