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
import { CSS } from '@dnd-kit/utilities';
import { DeleteForever } from '@ndla/icons/editor';
import { BlockResource, ListResource, useSnack } from '@ndla/ui';
import { useSortable } from '@dnd-kit/sortable';
import config from '../../../config';
import {
  GQLFolderResource,
  GQLFolderResourceMeta,
} from '../../../graphqlTypes';
import { ViewType } from './FoldersPage';
import { ResourceAction } from './ResourceList';
import { DraggableListItem, DragWrapper } from './DraggableFolder';
import { DragHandle } from './DragHandle';

interface DraggableResourceProps {
  id: string;
  resource: GQLFolderResource;
  index: number;
  loading: boolean;
  viewType: ViewType;
  setResourceAction: (action: ResourceAction | undefined) => void;
  keyedData: Dictionary<GQLFolderResourceMeta>;
}

const DraggableResource = ({
  resource,
  index,
  loading,
  viewType,
  setResourceAction,
  keyedData,
}: DraggableResourceProps) => {
  const { t } = useTranslation();
  const { addSnack } = useSnack();
  const Resource = viewType === 'block' ? BlockResource : ListResource;
  const resourceMeta =
    keyedData[`${resource.resourceType}-${resource.resourceId}`];

  const {
    attributes,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: resource.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <DraggableListItem
      key={`resource-${resource.id}`}
      id={`resource-${resource.id}`}
      ref={setNodeRef}
      style={style}
      isDragging={isDragging}
      {...attributes}>
      {viewType !== 'block' && <DragHandle sortableId={resource.id} />}
      <DragWrapper>
        <Resource
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
          resourceTypes={resourceMeta?.resourceTypes ?? []}
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
      </DragWrapper>
    </DraggableListItem>
  );
};

export default DraggableResource;
