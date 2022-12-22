/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FolderOutlined } from '@ndla/icons/contentType';
import { DeleteForever, Link } from '@ndla/icons/editor';
import { BlockResource, ListResource, useSnack } from '@ndla/ui';
import config from '../../../config';
import {
  GQLFolderResource,
  GQLFolderResourceMeta,
} from '../../../graphqlTypes';
import { DraggableListItem, DragWrapper } from './DraggableFolder';
import DragHandle from './DragHandle';
import { ViewType } from './FoldersPage';
import { ResourceAction } from './ResourceList';
import { AuthContext } from '../../../components/AuthenticationContext';

interface Props {
  resource: GQLFolderResource;
  viewType: ViewType;
  loading?: boolean;
  index: number;
  setResourceAction: (action: ResourceAction) => void;
  resourceMeta?: GQLFolderResourceMeta;
}

const DraggableResource = ({
  resource,
  loading,
  viewType,
  index,
  setResourceAction,
  resourceMeta,
}: Props) => {
  const { t } = useTranslation();
  const { examLock } = useContext(AuthContext);
  const { addSnack } = useSnack();
  const {
    attributes,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: resource.id,
    data: {
      name: resourceMeta?.title,
      index: index + 1,
    },
  });

  const Resource = viewType === 'block' ? BlockResource : ListResource;

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
      isDragging={isDragging}>
      {/* {viewType !== 'block' && (
        <DragHandle
          type="resource"
          name={resourceMeta?.title ?? ''}
          sortableId={resource.id}
          {...attributes}
        />
      )} */}
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
          menuItems={
            !examLock
              ? [
                  {
                    icon: <FolderOutlined />,
                    text: t('myNdla.resource.add'),
                    onClick: () =>
                      setResourceAction({ action: 'add', resource }),
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
                      setResourceAction({
                        action: 'delete',
                        resource,
                        index,
                      }),
                    type: 'danger',
                  },
                ]
              : undefined
          }
        />
      </DragWrapper>
    </DraggableListItem>
  );
};

export default DraggableResource;
