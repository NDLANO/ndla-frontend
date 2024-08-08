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
import { DeleteForever, FolderLine, LinkMedium } from "@ndla/icons/editor";
import { DraggableListItem, DragWrapper } from "./DraggableFolder";
import { AuthContext } from "../../../../components/AuthenticationContext";
import { AddResourceToFolderModalContent } from "../../../../components/MyNdla/AddResourceToFolderModal";
import BlockResource from "../../../../components/MyNdla/BlockResource";
import ListResource from "../../../../components/MyNdla/ListResource";
import { useToast } from "../../../../components/ToastContext";
import config from "../../../../config";
import {
  GQLFolder,
  GQLFolderResource,
  GQLFolderResourceMeta,
  GQLFolderResourceResourceType,
} from "../../../../graphqlTypes";
import DeleteModalContent from "../../components/DeleteModalContent";
import DragHandle from "../../components/DragHandle";
import SettingsMenu, { MenuItemProps } from "../../components/SettingsMenu";
import { useDeleteFolderResourceMutation } from "../../folderMutations";
import { ViewType } from "../FoldersPage";

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
  const toast = useToast();
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
      toast.create({
        title: t("myNdla.resource.removedFromFolder", {
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
    [resources, deleteFolderResource, selectedFolder.id, selectedFolder.name, toast, t, resourceRefId, setFocusId],
  );

  const Resource = viewType === "block" ? BlockResource : ListResource;

  const actions: MenuItemProps[] = useMemo(() => {
    if (examLock) return [];
    return [
      {
        icon: <FolderLine />,
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
        icon: <LinkMedium />,
        text: t("myNdla.resource.copyLink"),
        onClick: () => {
          navigator.clipboard.writeText(`${config.ndlaFrontendDomain}${resource.path}`);
          toast.create({
            title: t("myNdla.resource.linkCopied"),
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
  }, [examLock, index, onDeleteFolder, resource, selectedFolder, t, toast]);

  const menu = useMemo(() => <SettingsMenu menuItems={actions} />, [actions]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [resourceTypes, resourcePath] = useMemo(() => {
    let resTypes: GQLFolderResourceResourceType[] = [];
    let resPath = resource.path;

    if (!resourceMeta) return [resTypes, resPath];

    resTypes = resourceMeta.resourceTypes;

    if (resourceMeta.resourceTypes.length < 1) {
      if (resource.resourceType === "article" || resource.resourceType === "learningpath") {
        resPath = `/${resource.resourceType}${resource.resourceType === "learningpath" ? "s" : ""}/${resource.resourceId}`;
      }
      resTypes = [{ id: resource.resourceType, name: t(`contentTypes.${resource.resourceType}`) }];
    }

    return [resTypes, resPath];
  }, [resourceMeta, resource, t]);

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
          isLoading={loading}
          key={resource.id}
          resourceImage={{
            src: resourceMeta?.metaImage?.url ?? "",
            alt: "",
          }}
          link={resourcePath}
          resourceTypes={resourceTypes}
          title={resourceMeta?.title ?? t("myNdla.sharedFolder.resourceRemovedTitle")}
          description={viewType !== "list" ? resourceMeta?.description ?? "" : undefined}
          menu={menu}
        />
      </DragWrapper>
    </DraggableListItem>
  );
};

export default DraggableResource;
