/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { spacing } from "@ndla/core";
import { InformationOutline } from "@ndla/icons/common";
import { Subject } from "@ndla/icons/contentType";
import { ModalBody, Modal, ModalTrigger, ModalContent, ModalHeader, ModalTitle, ModalCloseButton } from "@ndla/modal";
import { Text } from "@ndla/typography";
import { useSnack, Folder, MessageBox } from "@ndla/ui";
import { AuthContext } from "../../../components/AuthenticationContext";
import LoginModalContent from "../../../components/MyNdla/LoginModalContent";
import { GQLFolder } from "../../../graphqlTypes";
import { routes } from "../../../routeHelpers";
import { useFavoriteSharedFolder } from "../../MyNdla/folderMutations";

const Content = styled(ModalBody)`
  display: flex;
  flex-direction: column;
  gap: ${spacing.normal};
`;

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: ${spacing.small};
  padding-top: ${spacing.large};
`;

interface SaveLinkProps {
  folder: GQLFolder;
  hideTrigger: () => void;
}

export const SaveLink = ({ folder: { id, name, subfolders, resources, status }, hideTrigger }: SaveLinkProps) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const { favoriteSharedFolder } = useFavoriteSharedFolder(id);
  const { authenticated } = useContext(AuthContext);
  const { addSnack } = useSnack();

  const onSaveLink = (name: string) => {
    favoriteSharedFolder();
    hideTrigger();
    setOpen(false);
    addSnack({
      content: t("myNdla.folder.sharing.savedLink", { name }),
      id: "sharedFolderSaved",
    });
  };

  return (
    <Modal open={open} onOpenChange={() => setOpen(!open)}>
      <ModalTrigger>
        <ButtonV2 aria-label={t("myNdla.folder.sharing.button.saveLink")} variant="ghost">
          <Subject />
          {t("myNdla.folder.sharing.button.saveLink")}
        </ButtonV2>
      </ModalTrigger>
      {authenticated ? (
        <ModalContent>
          <ModalHeader>
            <ModalTitle>{t("myNdla.folder.sharing.save.header")}</ModalTitle>
            <ModalCloseButton title={t("modal.closeModal")} />
          </ModalHeader>
          <ModalBody>
            <Content>
              <Folder
                id={id}
                title={name}
                subFolders={subfolders.length}
                subResources={resources.length}
                link={routes.folder(id)}
                isShared={status === "shared"}
              />
              <MessageBox>
                <InformationOutline />
                <Text margin="none">{t("myNdla.folder.sharing.save.warning")}</Text>
              </MessageBox>
            </Content>
            <ButtonRow>
              <ButtonV2 variant="outline" onClick={() => setOpen(false)}>
                {t("close")}
              </ButtonV2>
              <ButtonV2 onClick={() => onSaveLink(name)}>{t("myNdla.folder.sharing.button.saveLink")}</ButtonV2>
            </ButtonRow>
          </ModalBody>
        </ModalContent>
      ) : (
        <LoginModalContent
          title={t("myNdla.loginSaveFolderLinkPitch")}
          content={
            <Folder
              id={id.toString()}
              title={name ?? ""}
              link={`/folder/${id}`}
              isShared={true}
              subFolders={subfolders.length}
              subResources={resources.length}
            />
          }
        />
      )}
    </Modal>
  );
};
