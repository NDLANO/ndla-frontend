/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { IconButtonV2 } from "@ndla/button";
import { colors, spacing } from "@ndla/core";
import { DeleteForever } from "@ndla/icons/editor";
import { Modal, ModalTrigger } from "@ndla/modal";
import { useSnack } from "@ndla/ui";
import { useArenaDeleteCategoryMutation } from "../../arenaMutations";
import DeleteModalContent from "../../components/DeleteModalContent";

interface Props {
  categoryId: number;
  refetchCategories: (() => void) | undefined;
}

const StyledIconButton = styled(IconButtonV2)`
  width: ${spacing.mediumlarge};
  height: ${spacing.mediumlarge};
  color: ${colors.support.red};
  background-color: transparent;
`;

const DeleteCategoryModal = ({ categoryId, refetchCategories }: Props) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const { deleteCategory } = useArenaDeleteCategoryMutation();
  const { addSnack } = useSnack();

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger>
        <StyledIconButton
          title={t("myNdla.arena.admin.category.form.deleteCategory")}
          aria-label={t("myNdla.arena.admin.category.form.deleteCategory")}
        >
          <DeleteForever />
        </StyledIconButton>
      </ModalTrigger>
      <DeleteModalContent
        onDelete={async () => {
          await deleteCategory({
            variables: {
              categoryId,
            },
          });
          refetchCategories && refetchCategories();
          setOpen(false);
          addSnack({
            content: t("myNdla.arena.admin.category.deleteSnack"),
            id: "arenaCategoryDeleted",
          });
        }}
        title={t("myNdla.arena.admin.category.form.modalTitle")}
        description={t("myNdla.arena.admin.category.form.modalDescription")}
        removeText={t("myNdla.arena.admin.category.form.deleteText")}
      />
    </Modal>
  );
};

export default DeleteCategoryModal;
