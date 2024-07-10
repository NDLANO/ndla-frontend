/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { TrashCanOutline } from "@ndla/icons/action";
import { Modal, ModalTrigger } from "@ndla/modal";
import { Button } from "@ndla/primitives";
import DeleteModalContent from "../../components/DeleteModalContent";

interface Props {
  onDelete: () => void;
  onClose: (e?: Event) => void;
}

const FolderDeleteModal = ({ onDelete, onClose }: Props) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger>
        <Button variant="tertiary" aria-label={t("myNdla.folder.delete")} title={t("myNdla.folder.delete")}>
          <TrashCanOutline size="small" />
          {t("myNdla.folder.deleteShort")}
        </Button>
      </ModalTrigger>
      <DeleteModalContent
        onClose={onClose}
        onDelete={async () => {
          onDelete();
          setOpen(false);
          onClose();
        }}
        title={t("myNdla.folder.delete")}
        description={t("myNdla.confirmDeleteFolder")}
        removeText={t("myNdla.folder.delete")}
      />
    </Modal>
  );
};

export default FolderDeleteModal;
