/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { breakpoints, colors, fonts, mq, spacing } from '@ndla/core';
import { MenuButton, MenuItemProps } from '@ndla/button';
import { Pencil } from '@ndla/icons/action';
import { DeleteForever } from '@ndla/icons/editor';
import { Back } from '@ndla/icons/common';
import SafeLink from '@ndla/safelink';
import { ActionBreadcrumb } from '@ndla/ui';
import { GQLBreadcrumb } from '../../../graphqlTypes';
import { FolderActionType } from './FoldersPage';
import IsMobileContext from '../../../IsMobileContext';

interface Props {
  breadcrumbs: GQLBreadcrumb[];
  onActionChanged: (action: FolderActionType) => void;
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

  const actionItems: MenuItemProps[] = useMemo(
    () => [
      {
        icon: <Pencil />,
        text: t('myNdla.folder.edit'),
        onClick: () => onActionChanged('edit'),
      },
      {
        icon: <DeleteForever />,
        text: t('myNdla.folder.delete'),
        type: 'danger',
        onClick: () => onActionChanged('delete'),
      },
    ],
    [t, onActionChanged],
  );
  const correctCrumbs = useMemo(
    () =>
      breadcrumbs.map(({ name, id }) => ({
        name,
        to: `/minnlda/folders/${id}`,
      })),
    [breadcrumbs],
  );

  const crumbs = useMemo(
    () =>
      [{ name: t('myNdla.myFolders'), to: '/minndla/folders' }].concat(
        correctCrumbs,
      ),
    [correctCrumbs, t],
  );

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

  return <ActionBreadcrumb actionItems={actionItems} items={crumbs} />;
};

export default FolderBreadcrumb;
