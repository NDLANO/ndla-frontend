/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { breakpoints, mq } from "@ndla/core";
import { Plus } from "@ndla/icons/action";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalTitle, ModalTrigger } from "@ndla/modal";
import FolderForm, { FolderFormValues } from "./FolderForm";
import { buttonCss, iconCss } from "./FoldersPage";
import { GQLFolder } from "../../../graphqlTypes";
import { useAddFolderMutation, useFolders } from "../folderMutations";

const AddButton = styled(ButtonV2)`
  ${mq.range({ until: breakpoints.tablet })} {
    flex: 1;
  }
`;

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
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger>
        <AddButton
          css={buttonCss}
          variant="ghost"
          colorTheme="lighter"
          aria-label={t("myNdla.newFolder")}
          title={t("myNdla.newFolder")}
        >
          <Plus css={iconCss} />
          <span>{t("myNdla.newFolderShort")}</span>
        </AddButton>
      </ModalTrigger>
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
    </Modal>
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
    <ModalContent onCloseAutoFocus={onClose}>
      <ModalHeader>
        <ModalTitle>{t("myNdla.newFolder")}</ModalTitle>
        <ModalCloseButton />
      </ModalHeader>
      <ModalBody>
        <FolderForm
          siblings={parentFolder?.subfolders ?? folders ?? []}
          onSave={async (values) => {
            skipAutoFocus?.();
            await onCreate(values);
            onClose();
          }}
        />
      </ModalBody>
    </ModalContent>
  );
};
