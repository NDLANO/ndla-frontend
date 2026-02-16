/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { DeleteBinLine, FolderLine, LinkMedium } from "@ndla/icons";
import { useCallback, useContext, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../../../components/AuthenticationContext";
import { AddResourceToFolderModalContent } from "../../../../components/MyNdla/AddResourceToFolderModalContent";
import { DeleteModalContent } from "../../../../components/MyNdla/DeleteModalContent";
import { ListResource } from "../../../../components/MyNdla/ListResource";
import { useToast } from "../../../../components/ToastContext";
import config from "../../../../config";
import { GQLFolder, GQLMyNdlaResource, GQLMyNdlaResourceMetaFragment } from "../../../../graphqlTypes";
import { useDeleteMyNdlaResourceMutation } from "../../../../mutations/folder/folderMutations";
import { SettingsMenu, MenuItemProps } from "../../components/SettingsMenu";
import { resourceId, RESOURCES_HEADING_ID } from "../util";

interface Props {
  resource: GQLMyNdlaResource;
  selectedFolder: GQLFolder | undefined;
  loading?: boolean;
  resourceMeta?: GQLMyNdlaResourceMetaFragment;
}

export const ResourceWithMenu = ({ resource, loading, resourceMeta, selectedFolder }: Props) => {
  const { t } = useTranslation();
  const { examLock } = useContext(AuthContext);
  const toast = useToast();
  const ref = useRef<HTMLLIElement>(null);

  const [deleteMyNdlaResource] = useDeleteMyNdlaResourceMutation(selectedFolder?.id);

  const onDeleteResource = useCallback(
    async (resource: GQLMyNdlaResource) => {
      const nextFocusElement = ref.current?.nextElementSibling ?? ref?.current?.previousElementSibling;
      const res = await deleteMyNdlaResource({
        variables: { folderId: selectedFolder?.id, resourceId: resource.id },
      });
      const name = selectedFolder?.name ?? t("myNdla.myFavorites");
      if (res.error) {
        toast.create({ title: t("myNdla.resource.removedFromFailed", { name }) });
        return;
      }
      toast.create({ title: t("myNdla.resource.removedFrom", { name }) });
      if (nextFocusElement instanceof HTMLElement) {
        nextFocusElement.getElementsByTagName("a")?.[0]?.focus();
      } else {
        setTimeout(() => document.getElementById(RESOURCES_HEADING_ID)?.focus({ preventScroll: true }), 1);
      }
    },
    [deleteMyNdlaResource, selectedFolder?.id, selectedFolder?.name, toast, t],
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
          toast.create({ title: t("myNdla.resource.linkCopied") });
        },
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
              await onDeleteResource(resource);
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
  }, [examLock, onDeleteResource, resource, selectedFolder, t, toast]);

  const menu = useMemo(() => <SettingsMenu menuItems={actions} />, [actions]);

  const resourcePath = useMemo(() => {
    let resPath = resource.path;

    if (!resourceMeta) return resPath;

    if (resourceMeta.resourceTypes.length < 1) {
      if (resource.resourceType === "article" || resource.resourceType === "learningpath") {
        resPath = `/${resource.resourceType}${resource.resourceType === "learningpath" ? "s" : ""}/${resource.resourceId}`;
      }
    }

    return resPath;
  }, [resourceMeta, resource]);

  return (
    <li id={resourceId(resource.id)} ref={ref}>
      <ListResource
        id={resource.id}
        isLoading={loading}
        resourceImage={{
          src: resourceMeta?.metaImage?.url,
          alt: "",
        }}
        link={resourcePath}
        storedResourceType={resource.resourceType}
        resourceTypes={resourceMeta?.resourceTypes}
        traits={resourceMeta?.__typename === "MyNdlaArticleResourceMeta" ? resourceMeta.traits : undefined}
        title={resourceMeta?.title ?? t("myNdla.sharedFolder.resourceRemovedTitle")}
        description={resourceMeta?.description ?? ""}
        menu={menu}
        nonInteractive={!resourceMeta}
      />
    </li>
  );
};
