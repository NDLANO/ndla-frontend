/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useApolloClient } from "@apollo/client";
import { PencilFill } from "@ndla/icons/action";
import {
  Button,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@ndla/primitives";
import FolderForm from "./FolderForm";
import { DialogCloseButton } from "../../../../components/DialogCloseButton";
import { GQLFolder } from "../../../../graphqlTypes";
import { useUpdateFolderMutation, useFolders, getFolder } from "../../folderMutations";

interface Props {
  folder?: GQLFolder;
  onSaved: () => void;
}

const FolderEditModal = ({ folder, onSaved }: Props) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <DialogRoot open={open} onOpenChange={(details) => setOpen(details.open)}>
      <DialogTrigger asChild>
        <Button variant="tertiary" aria-label={t("myNdla.folder.edit")} title={t("myNdla.folder.edit")}>
          <PencilFill size="small" />
          {t("myNdla.folder.editShort")}
        </Button>
      </DialogTrigger>
      <EditFolderModalContent folder={folder} onClose={() => setOpen(false)} onSaved={onSaved} />
    </DialogRoot>
  );
};

export default FolderEditModal;

interface ContentProps {
  folder?: GQLFolder;
  onClose: () => void;
  onSaved: () => void;
}

export const EditFolderModalContent = ({ folder, onClose, onSaved }: ContentProps) => {
  const { t } = useTranslation();
  const { updateFolder, loading } = useUpdateFolderMutation();
  const { cache } = useApolloClient();
  const { folders } = useFolders();

  const levelFolders = useMemo(
    () => (folder?.parentId ? getFolder(cache, folder.parentId)?.subfolders ?? [] : folders),
    [cache, folder?.parentId, folders],
  );

  const siblings = levelFolders.filter((f) => f.id !== folder?.id);

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{t("myNdla.folder.edit")}</DialogTitle>
        <DialogCloseButton />
      </DialogHeader>
      <DialogBody>
        {folder && (
          <FolderForm
            folder={folder}
            siblings={siblings}
            onSave={async (values) => {
              await updateFolder({
                variables: {
                  id: folder.id,
                  name: values.name,
                  description: values.description,
                },
              });
              onSaved();
              onClose();
            }}
            loading={loading}
          />
        )}
      </DialogBody>
    </DialogContent>
  );
};
