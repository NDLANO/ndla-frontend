/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext } from 'react';
import { useApolloClient } from '@apollo/client';
import styled from '@emotion/styled';
import { breakpoints, colors, fonts, mq, spacing } from '@ndla/core';
import { MenuButton, MenuItemProps } from '@ndla/button';
import { Pencil } from '@ndla/icons/action';
import { DeleteForever } from '@ndla/icons/editor';
import { Back } from '@ndla/icons/common';
import SafeLink from '@ndla/safelink';
import { ActionBreadcrumb } from '@ndla/ui';
import { useTranslation } from 'react-i18next';
import { GQLBreadcrumb } from '../../../graphqlTypes';
import { getFolder } from '../folderMutations';
import { FolderAction } from './FoldersPage';
import IsMobileContext from '../../../IsMobileContext';

interface Props {
  breadcrumbs: GQLBreadcrumb[];
  onActionChanged: (action: FolderAction) => void;
}

const BreadcrumbContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.small};
`;

const StyledBackArrow = styled(SafeLink)`
  display: none;
  box-shadow: none;
  color: ${colors.brand.primary};

  svg {
    width: 22px;
    height: 22px;
  }

  ${mq.range({ until: breakpoints.tablet })} {
    display: block;
  }
`;

const StyledSpan = styled.span`
  color: ${colors.text.primary};
  font-weight: ${fonts.weight.bold};
`;

const FolderBreadcrumb = ({ breadcrumbs, onActionChanged }: Props) => {
  const { t } = useTranslation();
  const { cache } = useApolloClient();
  const isMobile = useContext(IsMobileContext);
  const baseCrumb: GQLBreadcrumb = {
    id: 'folders',
    name: t('myNdla.myFolders'),
  };
  const lastBreadcrumb = breadcrumbs[breadcrumbs.length - 1] ?? baseCrumb;
  const backUrl =
    breadcrumbs.length > 0
      ? `/minndla/folders/${breadcrumbs[breadcrumbs.length - 2]?.id ?? ''}`
      : '/minndla/meny';

  const actionItems: MenuItemProps[] = [
    {
      icon: <Pencil />,
      text: t('myNdla.folder.edit'),
      onClick: () =>
        onActionChanged({
          action: 'edit',
          folder: getFolder(cache, lastBreadcrumb.id)!,
        }),
    },
    {
      icon: <DeleteForever />,
      text: t('myNdla.folder.delete'),
      onClick: () =>
        onActionChanged({
          action: 'delete',
          folder: getFolder(cache, lastBreadcrumb.id)!,
        }),
      type: 'danger',
    },
  ];

  if (isMobile) {
    return (
      <BreadcrumbContainer>
        <StyledBackArrow to={backUrl}>
          <Back />
        </StyledBackArrow>
        <MenuButton
          menuItems={actionItems}
          size="small"
          disabled={!breadcrumbs.length}
          hideMenuIcon={!breadcrumbs.length}>
          <StyledSpan title={lastBreadcrumb.name}>
            {lastBreadcrumb.name}
          </StyledSpan>
        </MenuButton>
      </BreadcrumbContainer>
    );
  }

  return (
    <ActionBreadcrumb
      actionItems={actionItems}
      items={[
        { name: t('myNdla.myFolders'), to: '/minndla/folders' },
        ...breadcrumbs?.map(crumb => ({
          name: crumb.name,
          to: `/minndla/folders/${crumb.id}`,
        })),
      ]}
    />
  );
};

export default FolderBreadcrumb;
