/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DeleteBinLine } from "@ndla/icons";
import { DialogRoot, DialogTrigger, IconButton } from "@ndla/primitives";
import { useToast } from "../../../../components/ToastContext";
import { useArenaDeleteCategoryMutation } from "../../arenaMutations";
import DeleteModalContent from "../../components/DeleteModalContent";

interface Props {
  categoryId: number;
  refetchCategories: (() => void) | undefined;
}

const DeleteCategoryModal = ({ categoryId, refetchCategories }: Props) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const { deleteCategory } = useArenaDeleteCategoryMutation();
  const toast = useToast();

  const onDeleteCategory = async () => {
    await deleteCategory({
      variables: {
        categoryId,
      },
    });
    refetchCategories?.();
    setOpen(false);
    toast.create({
      title: t("myNdla.arena.admin.category.deleteSnack"),
    });
  };

  return (
    <DialogRoot open={open} onOpenChange={(details) => setOpen(details.open)}>
      <DialogTrigger asChild>
        <IconButton
          title={t("myNdla.arena.admin.category.form.deleteCategory")}
          aria-label={t("myNdla.arena.admin.category.form.deleteCategory")}
          variant="danger"
        >
          <DeleteBinLine />
        </IconButton>
      </DialogTrigger>
      <DeleteModalContent
        onDelete={onDeleteCategory}
        title={t("myNdla.arena.admin.category.form.modalTitle")}
        description={t("myNdla.arena.admin.category.form.modalDescription")}
        removeText={t("myNdla.arena.admin.category.form.deleteText")}
      />
    </DialogRoot>
  );
};

export default DeleteCategoryModal;
