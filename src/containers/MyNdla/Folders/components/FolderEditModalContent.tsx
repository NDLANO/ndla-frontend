/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useApolloClient } from "@apollo/client";
import { DialogBody, DialogContent, DialogHeader, DialogTitle } from "@ndla/primitives";
import FolderForm from "./FolderForm";
import { DialogCloseButton } from "../../../../components/DialogCloseButton";
import { useToast } from "../../../../components/ToastContext";
import { GQLFolder } from "../../../../graphqlTypes";
import { useUpdateFolderMutation, useFolders, getFolder } from "../../folderMutations";

interface Props {
  folder?: GQLFolder;
  onClose: () => void;
  onSaved: () => void;
}

export const FolderEditModalContent = ({ folder, onClose, onSaved }: Props) => {
  const { t } = useTranslation();
  const [updateFolder, { loading }] = useUpdateFolderMutation();
  const { cache } = useApolloClient();
  const { folders } = useFolders();
  const toast = useToast();

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
        {!!folder && (
          <FolderForm
            folder={folder}
            siblings={siblings}
            onSave={async (values) => {
              const res = await updateFolder({
                variables: {
                  id: folder.id,
                  name: values.name,
                  description: values.description,
                },
              });
              if (!res.errors?.length) {
                onSaved();
                onClose();
              } else {
                toast.create({ title: t("myNdla.folder.updateFailed") });
              }
            }}
            loading={loading}
          />
        )}
      </DialogBody>
    </DialogContent>
  );
};

export default FolderEditModalContent;
