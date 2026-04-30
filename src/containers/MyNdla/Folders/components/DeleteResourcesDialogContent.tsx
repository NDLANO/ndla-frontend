/**
 * Copyright (c) 2026-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useDialogContext } from "@ark-ui/react";
import { Button, DialogBody, DialogCloseTrigger, DialogFooter, DialogHeader, DialogTitle } from "@ndla/primitives";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { DialogCloseButton } from "../../../../components/DialogCloseButton";
import { useToast } from "../../../../components/ToastContext";
import type { GQLFolder } from "../../../../graphqlTypes";
import { useDeleteMyNdlaResourcesMutation } from "../../../../mutations/folder/folderMutations";

interface Props {
  selectedFolder: GQLFolder | undefined;
  onSuccessfulMutation: VoidFunction;
  resourceIds: string[];
}

export const DeleteResourcesDialogContent = ({ selectedFolder, resourceIds, onSuccessfulMutation }: Props) => {
  const [mutate, { loading }] = useDeleteMyNdlaResourcesMutation();
  const { t } = useTranslation();
  const toast = useToast();
  const { setOpen } = useDialogContext();

  const onDelete = useCallback(async () => {
    const res = await mutate({
      variables: { folderId: selectedFolder?.id ?? null, resourceIds },
      update: (cache, res) => {
        if (res.errors?.length) return;
        if (selectedFolder) {
          cache.modify({
            id: cache.identify({ __typename: "Folder", id: selectedFolder.id }),
            fields: {
              resources(existing, { readField }) {
                return existing.filter((ref: any) => {
                  const resourceId = readField("id", ref) as string;
                  return !resourceIds.includes(resourceId);
                });
              },
            },
          });
        } else {
          cache.modify({
            fields: {
              myNdlaRootResources(existing, { readField }) {
                return existing.filter((ref: any) => {
                  const resourceId = readField("id", ref) as string;
                  return !resourceIds.includes(resourceId);
                });
              },
            },
          });
        }
        resourceIds.forEach((id) => {
          cache.evict({
            id: cache.identify({
              __typename: "MyNdlaResourceConnection",
              resourceId: id,
              folderId: selectedFolder?.id,
            }),
          });
        });
        cache.gc();
      },
    });
    if (res.error) {
      toast.create({ title: t("myNdla.resource.deleteFromFailed") });
      return;
    }
    toast.create({ title: t("myNdla.resource.deleteFromSuccess") });
    onSuccessfulMutation();
    setOpen(false);
  }, [mutate, onSuccessfulMutation, resourceIds, selectedFolder, setOpen, t, toast]);
  return (
    <>
      <DialogHeader>
        <DialogTitle>{t("myNdla.resource.deleteResourcesDialogTitle")}</DialogTitle>
        <DialogCloseButton />
      </DialogHeader>
      <DialogBody>{t("myNdla.resource.deleteResourcesDialogDescription")}</DialogBody>
      <DialogFooter>
        <DialogCloseTrigger asChild>
          <Button variant="secondary">{t("cancel")}</Button>
        </DialogCloseTrigger>
        <Button variant="danger" onClick={onDelete} loading={loading}>
          {t("myNdla.resource.remove")}
        </Button>
      </DialogFooter>
    </>
  );
};
