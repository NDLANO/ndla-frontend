/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { InformationLine, AlertLine } from "@ndla/icons";
import {
  Button,
  Text,
  MessageBox,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { Folder } from "./Folder";
import { FolderSelect } from "./FolderSelect";
import { GQLFolder } from "../../graphqlTypes";
import { useCopySharedFolderMutation } from "../../mutations/folder/folderMutations";
import { useFolders } from "../../mutations/folder/folderQueries";
import { routes } from "../../routeHelpers";
import { getTotalCountForFolder } from "../../util/folderHelpers";
import { AuthContext } from "../AuthenticationContext";
import { DialogCloseButton } from "../DialogCloseButton";
import { useToast } from "../ToastContext";

interface Props {
  folder: GQLFolder;
  onClose: () => void;
}

const StyledDialogBody = styled(DialogBody, {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "medium",
  },
});

export const CopyFolder = ({ folder, onClose }: Props) => {
  const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>(undefined);

  const { examLock } = useContext(AuthContext);
  const { t } = useTranslation();
  const toast = useToast();
  const { folders, loading } = useFolders();
  const [copySharedFolder, { error, loading: copyLoading }] = useCopySharedFolderMutation();
  const folderCount = useMemo(() => getTotalCountForFolder(folder), [folder]);

  const onSave = async () => {
    await copySharedFolder({
      variables: {
        folderId: folder.id,
        destinationFolderId: selectedFolderId === "folders" ? undefined : selectedFolderId,
      },
    });
    onClose();
    toast.create({ title: t("myNdla.sharedFolder.folderCopied") });
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{t("myNdla.resource.copyToMyNdla")}</DialogTitle>
        <DialogCloseButton />
      </DialogHeader>
      <StyledDialogBody>
        <Folder nonInteractive folder={folder} foldersCount={folderCount} link={routes.folder(folder.id)} />
        {examLock ? (
          <MessageBox variant="warning">
            <InformationLine />
            <Text>{t("myNdla.examLockInfo")}</Text>
          </MessageBox>
        ) : (
          <>
            <FolderSelect
              folders={folders}
              loading={loading}
              selectedFolderId={selectedFolderId}
              setSelectedFolderId={setSelectedFolderId}
            />
            <MessageBox variant="warning">
              <InformationLine />
              <Text>{t("myNdla.copyFolderDisclaimer")}</Text>
            </MessageBox>
            {!!error && (
              <MessageBox variant="error">
                <AlertLine />
                <Text>{t("errorMessage.description")}</Text>
              </MessageBox>
            )}
          </>
        )}
      </StyledDialogBody>
      <DialogFooter>
        <Button
          variant="secondary"
          onClick={onClose}
          onMouseDown={(e) => {
            e.preventDefault();
          }}
          onMouseUp={(e) => {
            e.preventDefault();
          }}
        >
          {t("cancel")}
        </Button>
        <Button
          loading={copyLoading}
          disabled={examLock}
          onMouseDown={(e) => {
            e.preventDefault();
          }}
          onMouseUp={(e) => {
            e.preventDefault();
          }}
          onClick={onSave}
          aria-label={copyLoading ? t("loading") : undefined}
        >
          {t("myNdla.resource.save")}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
