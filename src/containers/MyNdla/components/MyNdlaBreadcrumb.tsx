/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { breakpoints, colors, mq, spacing } from '@ndla/core';
import { Back } from '@ndla/icons/common';
import SafeLink from '@ndla/safelink';
import { Breadcrumb } from '@ndla/ui';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { GQLBreadcrumb } from '../../../graphqlTypes';
import IsMobileContext from '../../../IsMobileContext';

interface Props {
  breadcrumbs: GQLBreadcrumb[];
  page: PageType;
  backCrumb: PageType | GQLBreadcrumb;
}

type PageType = 'folders' | 'tags' | 'minndla';

const types = {
  folders: {
    to: '/minndla/folders',
    name: 'myNdla.myFolders',
  },
  tags: {
    to: '/minndla/tags',
    name: 'myNdla.myTags',
  },
  minndla: {
    to: '/minndla/meny',
    name: 'myNdla.myNDLA',
  },
};

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
  color: ${colors.brand.primary};
`;

const MyNdlaBreadcrumb = ({ breadcrumbs, backCrumb, page }: Props) => {
  const isMobile = useContext(IsMobileContext);
  const { t } = useTranslation();
  const back =
    typeof backCrumb === 'object'
      ? { name: backCrumb.name, to: `/minndla/folders/${backCrumb.id}` }
      : { ...types[backCrumb], name: t(types[backCrumb].name) };

  const baseCrumb = types[page];
  const crumbs = [{ to: baseCrumb.to, name: t(baseCrumb.name) }].concat(
    breadcrumbs.map(bc => ({ name: bc.name, to: `/minndla/${page}/${bc.id}` })),
  );

  if (isMobile) {
    return (
      <BreadcrumbContainer>
        <StyledBackArrow to={back.to}>
          <Back />
        </StyledBackArrow>
        <StyledSpan title={back.name}>{back.name}</StyledSpan>
      </BreadcrumbContainer>
    );
  }
  if (breadcrumbs.length > 0) {
    return <Breadcrumb items={crumbs} autoCollapse />;
  }
  return null;
};

export default MyNdlaBreadcrumb;
