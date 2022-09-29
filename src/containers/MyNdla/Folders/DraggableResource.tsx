/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Dictionary } from 'lodash';
import { useTranslation } from 'react-i18next';
import { Link } from '@ndla/icons/common';
import { FolderOutlined } from '@ndla/icons/contentType';
import { DeleteForever } from '@ndla/icons/editor';
import { BlockResource, ListResource, useSnack } from '@ndla/ui';
import { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';
import config from '../../../config';
import {
  GQLFolderResource,
  GQLFolderResourceMeta,
} from '../../../graphqlTypes';
import { ListItem, ViewType } from './FoldersPage';
import { contentTypeMapping } from '../../../util/getContentType';
import { ResourceAction } from './ResourceList';

interface DraggableResourceProps {
  id: string;
  resource: GQLFolderResource;
  index: number;
  loading: boolean;
  viewType: ViewType;
  setResourceAction: (action: ResourceAction | undefined) => void;
  dragHandleProps?: DraggableProvidedDragHandleProps;
  keyedData: Dictionary<GQLFolderResourceMeta>;
}

const DraggableResource = ({
  resource,
  index,
  loading,
  viewType,
  setResourceAction,
  dragHandleProps,
  keyedData,
}: DraggableResourceProps) => {
  const { t } = useTranslation();
  const { addSnack } = useSnack();
  const Resource = viewType === 'block' ? BlockResource : ListResource;
  const resourceMeta =
    keyedData[`${resource.resourceType}-${resource.resourceId}`];
  const resourceTypeId = resourceMeta?.resourceTypes?.[0]?.id ?? '';
  const contentType = contentTypeMapping[resourceTypeId] ?? '';
  return (
    <ListItem
      key={`resource-${resource.id}`}
      id={`resource-${resource.id}`}
      tabIndex={-1}
      {...dragHandleProps}>
      <Resource
        contentType={contentType}
        id={resource.id}
        tagLinkPrefix="/minndla/tags"
        isLoading={loading}
        key={resource.id}
        resourceImage={{
          src: resourceMeta?.metaImage?.url ?? '',
          alt: '',
        }}
        link={resource.path}
        tags={resource.tags}
        topics={resourceMeta?.resourceTypes.map(rt => rt.name) ?? []}
        title={resourceMeta?.title ?? ''}
        description={
          viewType !== 'list' ? resourceMeta?.description ?? '' : undefined
        }
        menuItems={[
          {
            icon: <FolderOutlined />,
            text: t('myNdla.resource.add'),
            onClick: () => setResourceAction({ action: 'add', resource }),
          },
          {
            icon: <Link />,
            text: t('myNdla.resource.copyLink'),
            onClick: () => {
              navigator.clipboard.writeText(
                `${config.ndlaFrontendDomain}${resource.path}`,
              );
              addSnack({
                content: t('myNdla.resource.linkCopied'),
                id: 'linkCopied',
              });
            },
          },
          {
            icon: <DeleteForever />,
            text: t('myNdla.resource.remove'),
            onClick: () =>
              setResourceAction({ action: 'delete', resource, index }),
            type: 'danger',
          },
        ]}
      />
    </ListItem>
  );
};

export default DraggableResource;
