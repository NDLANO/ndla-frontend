/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { Breadcrumb, SimpleBreadcrumbItem } from '@ndla/ui';

interface Props {
  breadcrumbs: SimpleBreadcrumbItem[];
  page: PageType;
}

type PageType = 'folders' | 'tags' | 'subjects' | 'arena';

const types = {
  folders: {
    to: '/minndla/folders',
    name: 'myNdla.myFolders',
  },
  tags: {
    to: '/minndla/tags',
    name: 'myNdla.myTags',
  },
  subjects: {
    to: '/minndla/subjects',
    name: 'myNdla.favoriteSubjects',
  },
  arena: {
    to: '/minndla/arena',
    name: 'myNdla.arena.title',
  },
};

const MyNdlaBreadcrumb = ({ breadcrumbs, page }: Props) => {
  const { t } = useTranslation();

  const baseCrumb = types[page];
  const crumbs = breadcrumbs.map((bc) => ({
    name: bc.name,
    to: `/minndla/${page}/${bc.to}`,
  }));
  crumbs.unshift({ to: baseCrumb.to, name: t(baseCrumb.name) });

  if (breadcrumbs.length > 0) {
    return <Breadcrumb items={crumbs} />;
  }
  return null;
};

export default MyNdlaBreadcrumb;
