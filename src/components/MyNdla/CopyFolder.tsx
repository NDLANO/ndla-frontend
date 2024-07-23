/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { LoadingButton } from "@ndla/button";
import { InformationOutline, WarningOutline } from "@ndla/icons/common";
import { ModalContent, ModalHeader, ModalTitle, ModalCloseButton, ModalBody } from "@ndla/modal";
import { Button, Text, MessageBox } from "@ndla/primitives";
import { AddResourceContainer, ButtonRow } from "./AddResourceToFolder";
import { Folder } from "./Folder";
import FolderSelect from "./FolderSelect";
import { useCopySharedFolderMutation, useFolders } from "../../containers/MyNdla/folderMutations";
import { GQLFolder } from "../../graphqlTypes";
import { routes } from "../../routeHelpers";
import { getTotalCountForFolder } from "../../util/folderHelpers";
import { AuthContext } from "../AuthenticationContext";
import { useToast } from "../ToastContext";

interface Props {
  folder: GQLFolder;
  onClose: () => void;
}

const CopyFolder = ({ folder, onClose }: Props) => {
  const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>(undefined);

  const { examLock } = useContext(AuthContext);
  const { t } = useTranslation();
  const toast = useToast();
  const { folders, loading } = useFolders();
  const copySharedFolderMutation = useCopySharedFolderMutation();
  const folderCount = useMemo(() => getTotalCountForFolder(folder), [folder]);

  const onSave = async () => {
    await copySharedFolderMutation.copySharedFolder({
      variables: {
        folderId: folder.id,
        destinationFolderId: selectedFolderId === "folders" ? undefined : selectedFolderId,
      },
    });
    onClose();
    toast.create({ title: t("myNdla.sharedFolder.folderCopied") });
  };

  return (
    <ModalContent>
      <ModalHeader>
        <ModalTitle>{t("myNdla.resource.copyToMyNdla")}</ModalTitle>
        <ModalCloseButton title={t("modal.closeModal")} />
      </ModalHeader>
      <ModalBody>
        <AddResourceContainer>
          <Folder folder={folder} foldersCount={folderCount} link={routes.folder(folder.id)} />
          {examLock ? (
            <MessageBox variant="warning">
              <InformationOutline />
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
                <InformationOutline />
                <Text>{t("myNdla.copyFolderDisclaimer")}</Text>
              </MessageBox>
              {copySharedFolderMutation.error && (
                <MessageBox variant="error">
                  <WarningOutline />
                  <Text>{t("errorMessage.description")}</Text>
                </MessageBox>
              )}
            </>
          )}
          <ButtonRow>
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
            <LoadingButton
              loading={copySharedFolderMutation.loading}
              colorTheme="light"
              disabled={examLock || copySharedFolderMutation.loading}
              onMouseDown={(e) => {
                e.preventDefault();
              }}
              onMouseUp={(e) => {
                e.preventDefault();
              }}
              onClick={onSave}
            >
              {t("myNdla.resource.save")}
            </LoadingButton>
          </ButtonRow>
        </AddResourceContainer>
      </ModalBody>
    </ModalContent>
  );
};

export default CopyFolder;
