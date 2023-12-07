/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Breadcrumb } from '@ndla/ui';
import { useTranslation } from 'react-i18next';
import { GQLBreadcrumb } from '../../../graphqlTypes';
import {
  MyNdla,
  MyNdlaArena,
  MyNdlaFolders,
  MyNdlaSubjects,
  MyNdlaTags,
} from '../../../routeHelpers';

interface Props {
  breadcrumbs: GQLBreadcrumb[];
  page: PageType;
}

type PageType = 'folders' | 'tags' | 'subjects' | 'arena';

const types = {
  folders: {
    to: MyNdlaFolders,
    name: 'myNdla.myFolders',
  },
  tags: {
    to: MyNdlaTags,
    name: 'myNdla.myTags',
  },
  subjects: {
    to: MyNdlaSubjects,
    name: 'myNdla.favoriteSubjects',
  },
  arena: {
    to: MyNdlaArena,
    name: 'myNdla.arena.title',
  },
};

const MyNdlaBreadcrumb = ({ breadcrumbs, page }: Props) => {
  const { t } = useTranslation();

  const baseCrumb = types[page];
  const crumbs = [{ to: baseCrumb.to, name: t(baseCrumb.name) }].concat(
    breadcrumbs.map((bc) => ({
      name: bc.name,
      to: `${MyNdla}/${page}/${bc.id}`,
    })),
  );

  if (breadcrumbs.length > 0) {
    return <Breadcrumb items={crumbs} />;
  }
  return null;
};

export default MyNdlaBreadcrumb;
