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
import { ButtonV2 } from "@ndla/button";
import { Pencil } from "@ndla/icons/action";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalTitle, ModalTrigger } from "@ndla/modal";
import FolderForm from "./FolderForm";
import { GQLFolder } from "../../../graphqlTypes";
import { buttonCss } from "../components/toolbarStyles";
import { useUpdateFolderMutation, useFolders, getFolder } from "../folderMutations";

interface Props {
  folder?: GQLFolder;
  onSaved: () => void;
}

const FolderEditModal = ({ folder, onSaved }: Props) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger>
        <ButtonV2
          css={buttonCss}
          variant="ghost"
          colorTheme="lighter"
          aria-label={t("myNdla.folder.edit")}
          title={t("myNdla.folder.edit")}
        >
          <Pencil size="nsmall" />
          {t("myNdla.folder.editShort")}
        </ButtonV2>
      </ModalTrigger>
      <EditFolderModalContent folder={folder} onClose={() => setOpen(false)} onSaved={onSaved} />
    </Modal>
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
    <ModalContent>
      <ModalHeader>
        <ModalTitle>{t("myNdla.folder.edit")}</ModalTitle>
        <ModalCloseButton />
      </ModalHeader>
      <ModalBody>
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
      </ModalBody>
    </ModalContent>
  );
};
