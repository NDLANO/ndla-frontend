/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FolderOutlined } from "@ndla/icons/contentType";
import { DeleteForever, Link } from "@ndla/icons/editor";
import { BlockResource, ListResource, useSnack } from "@ndla/ui";
import { DraggableListItem, DragWrapper } from "./DraggableFolder";
import DragHandle from "./DragHandle";
import { ViewType } from "./FoldersPage";
import { AuthContext } from "../../../components/AuthenticationContext";
import { AddResourceToFolderModalContent } from "../../../components/MyNdla/AddResourceToFolderModal";
import config from "../../../config";
import {
  GQLFolder,
  GQLFolderResource,
  GQLFolderResourceMeta,
  GQLFolderResourceResourceType,
} from "../../../graphqlTypes";
import { routes, toArticle } from "../../../routeHelpers";
import DeleteModalContent from "../components/DeleteModalContent";
import SettingsMenu, { MenuItemProps } from "../components/SettingsMenu";
import { useDeleteFolderResourceMutation } from "../folderMutations";

interface Props {
  resource: GQLFolderResource;
  resources: GQLFolderResource[];
  selectedFolder: GQLFolder;
  viewType: ViewType;
  loading?: boolean;
  index: number;
  resourceMeta?: GQLFolderResourceMeta;
  setFocusId: (id: string | undefined) => void;
  resourceRefId?: string;
}

const DraggableResource = ({
  resource,
  loading,
  viewType,
  index,
  resourceMeta,
  selectedFolder,
  resources,
  setFocusId,
  resourceRefId,
}: Props) => {
  const { t } = useTranslation();
  const { examLock } = useContext(AuthContext);
  const { addSnack } = useSnack();
  const { attributes, setNodeRef, transform, items, transition, isDragging } = useSortable({
    id: resource.id,
    data: {
      name: resourceMeta?.title,
      index: index + 1,
    },
  });

  const { deleteFolderResource } = useDeleteFolderResourceMutation(selectedFolder.id);

  const onDeleteFolder = useCallback(
    async (resource: GQLFolderResource, index?: number) => {
      const next = index !== undefined ? resources[index + 1]?.id : undefined;
      const prev = index !== undefined ? resources[index - 1]?.id : undefined;
      await deleteFolderResource({
        variables: { folderId: selectedFolder.id, resourceId: resource.id },
      });
      addSnack({
        id: `removedFromFolder${selectedFolder.id}`,
        content: t("myNdla.resource.removedFromFolder", {
          folderName: selectedFolder.name,
        }),
      });
      if (next || prev) {
        setFocusId(next ?? prev);
      } else if (resourceRefId) {
        setTimeout(
          () =>
            (
              document.getElementById(resourceRefId)?.getElementsByTagName("a")?.[0] ??
              document.getElementById(resourceRefId)
            )?.focus({ preventScroll: true }),
          1,
        );
      }
    },
    [addSnack, deleteFolderResource, resources, selectedFolder.id, selectedFolder.name, setFocusId, resourceRefId, t],
  );

  const Resource = viewType === "block" ? BlockResource : ListResource;

  const actions: MenuItemProps[] = useMemo(() => {
    if (examLock) return [];
    return [
      {
        icon: <FolderOutlined />,
        text: t("myNdla.resource.add"),
        isModal: true,
        modality: false,
        modalContent: (close) => (
          <AddResourceToFolderModalContent
            close={close}
            defaultOpenFolder={selectedFolder}
            resource={{
              id: resource.resourceId,
              resourceType: resource.resourceType,
              path: resource.path,
            }}
          />
        ),
      },
      {
        icon: <Link />,
        text: t("myNdla.resource.copyLink"),
        onClick: () => {
          navigator.clipboard.writeText(`${config.ndlaFrontendDomain}${resource.path}`);
          addSnack({
            content: t("myNdla.resource.linkCopied"),
            id: "linkCopied",
          });
        },
      },
      {
        icon: <DeleteForever />,
        text: t("myNdla.resource.remove"),
        isModal: true,
        modalContent: (close, setSkipAutoFocus) => (
          <DeleteModalContent
            onClose={close}
            onDelete={async () => {
              setSkipAutoFocus?.();
              await onDeleteFolder(resource, index);
              close();
            }}
            description={t("myNdla.resource.confirmRemove")}
            title={t("myNdla.resource.removeTitle")}
            removeText={t("myNdla.resource.remove")}
          />
        ),
        type: "danger",
      },
    ];
  }, [addSnack, examLock, index, onDeleteFolder, resource, selectedFolder, t]);

  const menu = useMemo(() => <SettingsMenu menuItems={actions} />, [actions]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [resourceType, resourcePath, resourceTitle] = useMemo(() => {
    let resType: GQLFolderResourceResourceType[] = [];

    if (!resourceMeta) {
      let resPath = resource.path;
      if (resource.resourceType === "article") {
        resPath = toArticle(Number(resource.resourceId), resource, "");
      }
      return [resType, resPath, t("myNdla.sharedFolder.resourceRemovedTitle")];
    }

    if (resourceMeta.resourceTypes && resourceMeta.resourceTypes.length > 0) {
      resType = resourceMeta.resourceTypes;
    } else {
      resType = [{ id: resource.resourceType, name: t(`contentTypes.${resource.resourceType}`) }];
    }

    return [resType, resource.path, resourceMeta.title];
  }, [resource, resourceMeta, t]);

  return (
    <DraggableListItem
      key={`resource-${resource.id}`}
      id={`resource-${resource.id}`}
      ref={setNodeRef}
      style={style}
      data-is-dragging={isDragging}
    >
      <DragHandle
        type="resource"
        disabled={viewType === "block" || items.length < 2}
        name={resourceMeta?.title ?? ""}
        sortableId={resource.id}
        {...attributes}
      />
      <DragWrapper>
        <Resource
          id={resource.id}
          tagLinkPrefix={routes.myNdla.tags}
          isLoading={loading}
          key={resource.id}
          resourceImage={{
            src: resourceMeta?.metaImage?.url ?? "",
            alt: "",
          }}
          link={resourcePath}
          tags={resource.tags}
          resourceTypes={resourceType}
          title={resourceTitle}
          description={viewType !== "list" ? resourceMeta?.description ?? "" : undefined}
          menu={menu}
        />
      </DragWrapper>
    </DraggableListItem>
  );
};

export default DraggableResource;
