/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { AddLine } from "@ndla/icons/action";
import {
  Button,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@ndla/primitives";
import FolderForm, { FolderFormValues } from "./FolderForm";
import { DialogCloseButton } from "../../../../components/DialogCloseButton";
import { GQLFolder } from "../../../../graphqlTypes";
import { useAddFolderMutation, useFolders } from "../../folderMutations";

interface Props {
  onSaved: (folder?: GQLFolder) => void;
  parentFolder?: GQLFolder | null;
}

const FolderCreateModal = ({ onSaved, parentFolder }: Props) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const { addFolder } = useAddFolderMutation();
  const [folderCreated, setFolderCreated] = useState(false);

  const { folders } = useFolders();

  const onModalClose = useCallback(
    (e?: Event) => {
      if (folderCreated) {
        e?.preventDefault();
        setFolderCreated(false);
      }
    },
    [folderCreated],
  );

  return (
    <DialogRoot open={open} onOpenChange={(details) => setOpen(details.open)}>
      <DialogTrigger asChild>
        <Button variant="tertiary" aria-label={t("myNdla.newFolder")} title={t("myNdla.newFolder")}>
          <AddLine size="small" />
          <span>{t("myNdla.newFolderShort")}</span>
        </Button>
      </DialogTrigger>
      <CreateModalContent
        onClose={onModalClose}
        parentFolder={parentFolder}
        folders={folders}
        onCreate={async (values) => {
          const res = await addFolder({
            variables: {
              name: values.name,
              description: values.description,
              parentId: parentFolder?.id ?? undefined,
            },
          });
          setFolderCreated(true);
          setOpen(false);
          const folder = res.data?.addFolder as GQLFolder | undefined;
          onSaved(folder);
        }}
      />
    </DialogRoot>
  );
};

export default FolderCreateModal;

interface ContentProps {
  onClose: (e?: Event) => void;
  onCreate: (values: FolderFormValues) => Promise<void>;
  folders?: GQLFolder[];
  parentFolder?: GQLFolder | null;
  skipAutoFocus?: VoidFunction;
}

export const CreateModalContent = ({ onClose, parentFolder, folders, onCreate, skipAutoFocus }: ContentProps) => {
  const { t } = useTranslation();
  return (
    // TODO: Thgere used to be a onCloseAUtoFocus here
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{t("myNdla.newFolder")}</DialogTitle>
        <DialogCloseButton />
      </DialogHeader>
      <DialogBody>
        <FolderForm
          siblings={parentFolder?.subfolders ?? folders ?? []}
          onSave={async (values) => {
            skipAutoFocus?.();
            await onCreate(values);
            onClose();
          }}
        />
      </DialogBody>
    </DialogContent>
  );
};
