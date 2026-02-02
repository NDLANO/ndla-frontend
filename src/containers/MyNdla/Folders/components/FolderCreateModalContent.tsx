/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { DialogBody, DialogContent, DialogHeader, DialogTitle } from "@ndla/primitives";
import { useTranslation } from "react-i18next";
import { DialogCloseButton } from "../../../../components/DialogCloseButton";
import { GQLFolder } from "../../../../graphqlTypes";
import { useFolders } from "../../../../mutations/folder/folderQueries";
import { FolderForm, FolderFormValues } from "./FolderForm";

interface Props {
  onClose: (e?: Event) => void;
  onCreate: (values: FolderFormValues) => Promise<void>;
  folders?: GQLFolder[];
  parentFolder?: GQLFolder | null;
}

export const FolderCreateModalContent = ({ onClose, parentFolder, onCreate }: Props) => {
  const { t } = useTranslation();
  const { folders } = useFolders();
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{t("myNdla.newFolder")}</DialogTitle>
        <DialogCloseButton />
      </DialogHeader>
      <DialogBody>
        <FolderForm
          siblings={parentFolder?.subfolders ?? folders ?? []}
          onSave={async (values) => {
            await onCreate(values);
            onClose();
          }}
        />
      </DialogBody>
    </DialogContent>
  );
};
