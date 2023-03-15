/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Back } from '@ndla/icons/common';
import { SafeLinkButton } from '@ndla/safelink';
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
      <SafeLinkButton variant="ghost" to={back.to}>
        <Back />
        {back.name}
      </SafeLinkButton>
    );
  }
  if (breadcrumbs.length > 0) {
    return <Breadcrumb items={crumbs} autoCollapse />;
  }
  return null;
};

export default MyNdlaBreadcrumb;
