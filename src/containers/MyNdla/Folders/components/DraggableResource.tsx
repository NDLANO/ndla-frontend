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
import { DeleteBinLine, HashTag, FolderLine, LinkMedium } from "@ndla/icons";
import { Text, DialogBody, DialogContent, DialogHeader, DialogTitle } from "@ndla/primitives";
import { SafeLinkButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { DragWrapper } from "./DraggableFolder";
import { AuthContext } from "../../../../components/AuthenticationContext";
import { DialogCloseButton } from "../../../../components/DialogCloseButton";
import { AddResourceToFolderModalContent } from "../../../../components/MyNdla/AddResourceToFolderModal";
import DeleteModalContent from "../../../../components/MyNdla/DeleteModalContent";
import ListResource from "../../../../components/MyNdla/ListResource";
import { useToast } from "../../../../components/ToastContext";
import config from "../../../../config";
import { GQLFolder, GQLFolderResource, GQLFolderResourceMeta } from "../../../../graphqlTypes";
import { useDeleteFolderResourceMutation } from "../../../../mutations/folderMutations";
import { routes } from "../../../../routeHelpers";
import { getResourceTypesForResource } from "../../../../util/folderHelpers";
import DragHandle from "../../components/DragHandle";
import SettingsMenu, { MenuItemProps } from "../../components/SettingsMenu";
import { DraggableListItem } from "../../Learningpath/components/DraggableListItem";

const StyledTagsWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: "xsmall",
  },
});

interface Props {
  resource: GQLFolderResource;
  resources: GQLFolderResource[];
  selectedFolder: GQLFolder;
  loading?: boolean;
  index: number;
  resourceMeta?: GQLFolderResourceMeta;
  setFocusId: (id: string | undefined) => void;
  resourceRefId?: string;
}

const DraggableResource = ({
  resource,
  loading,
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

  const [deleteFolderResource] = useDeleteFolderResourceMutation(selectedFolder.id);

  const onDeleteFolder = useCallback(
    async (resource: GQLFolderResource, index?: number) => {
      const next = index !== undefined ? resources[index + 1]?.id : undefined;
      const prev = index !== undefined ? resources[index - 1]?.id : undefined;
      const res = await deleteFolderResource({
        variables: { folderId: selectedFolder.id, resourceId: resource.id },
      });
      if (!res.errors?.length) {
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
      } else {
        toast.create({
          title: t("myNdla.resource.removedFromFolderFailed", {
            folderName: selectedFolder.name,
          }),
        });
      }
    },
    [resources, deleteFolderResource, selectedFolder.id, selectedFolder.name, toast, t, resourceRefId, setFocusId],
  );

  const actions: MenuItemProps[] = useMemo(() => {
    if (examLock) return [];
    return [
      {
        type: "dialog",
        value: "addResource",
        icon: <FolderLine />,
        text: t("myNdla.resource.add"),
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
        type: "action",
        value: "copyResourceLink",
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
        type: "dialog",
        value: "showTags",
        icon: <HashTag />,
        text: t("myNdla.resource.showTags"),
        isModal: true,
        modalContent: () => (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("myNdla.resource.tagsDialogTitle", { title: resourceMeta?.title ?? "" })}</DialogTitle>
              <DialogCloseButton />
            </DialogHeader>
            <DialogBody>
              {resource.tags.length ? (
                <StyledTagsWrapper>
                  {resource.tags.map((tag) => (
                    <SafeLinkButton variant="primary" size="small" key={tag} to={routes.myNdla.tag(tag)}>
                      <HashTag />
                      {tag}
                    </SafeLinkButton>
                  ))}
                </StyledTagsWrapper>
              ) : (
                <Text>{t("myNdla.resource.noTags")}</Text>
              )}
            </DialogBody>
          </DialogContent>
        ),
      },
      {
        type: "dialog",
        value: "removeResource",
        icon: <DeleteBinLine />,
        text: t("myNdla.resource.remove"),
        isModal: true,
        modalContent: (close) => (
          <DeleteModalContent
            onClose={close}
            onDelete={async () => {
              await onDeleteFolder(resource, index);
              close();
            }}
            description={t("myNdla.resource.confirmRemove")}
            title={t("myNdla.resource.removeTitle")}
            removeText={t("myNdla.resource.remove")}
          />
        ),
        variant: "destructive",
      },
    ];
  }, [examLock, index, onDeleteFolder, resource, resourceMeta?.title, selectedFolder, t, toast]);

  const menu = useMemo(() => <SettingsMenu menuItems={actions} />, [actions]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [resourceTypes, resourcePath] = useMemo(() => {
    let resPath = resource.path;

    if (!resourceMeta) return [[], resPath];

    const resTypes = getResourceTypesForResource(resource.resourceType, resourceMeta.resourceTypes, t);

    if (resourceMeta.resourceTypes.length < 1) {
      if (resource.resourceType === "article" || resource.resourceType === "learningpath") {
        resPath = `/${resource.resourceType}${resource.resourceType === "learningpath" ? "s" : ""}/${resource.resourceId}`;
      }
    }

    return [resTypes, resPath];
  }, [resourceMeta, resource, t]);

  return (
    <DraggableListItem
      key={`resource-${resource.id}`}
      id={`resource-${resource.id}`}
      ref={setNodeRef}
      style={style}
      isDragging={isDragging}
    >
      <DragHandle
        type="resource"
        disabled={items.length < 2}
        name={resourceMeta?.title ?? ""}
        sortableId={resource.id}
        {...attributes}
      />
      <DragWrapper>
        <ListResource
          id={resource.id}
          isLoading={loading}
          key={resource.id}
          resourceImage={{
            src: resourceMeta?.metaImage?.url,
            alt: "",
          }}
          link={resourcePath}
          resourceTypes={resourceTypes}
          title={resourceMeta?.title ?? t("myNdla.sharedFolder.resourceRemovedTitle")}
          description={resourceMeta?.description ?? ""}
          menu={menu}
          variant="subtle"
        />
      </DragWrapper>
    </DraggableListItem>
  );
};

export default DraggableResource;
