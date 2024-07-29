/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { spacing } from "@ndla/core";
import { InformationOutline } from "@ndla/icons/common";
import { Subject } from "@ndla/icons/contentType";
import { ModalBody, Modal, ModalTrigger, ModalContent, ModalHeader, ModalTitle, ModalCloseButton } from "@ndla/modal";
import { Button, MessageBox, Text } from "@ndla/primitives";
import { AuthContext } from "../../../components/AuthenticationContext";
import { Folder } from "../../../components/MyNdla/Folder";
import LoginModalContent from "../../../components/MyNdla/LoginModalContent";
import { useToast } from "../../../components/ToastContext";
import { GQLFolder } from "../../../graphqlTypes";
import { routes } from "../../../routeHelpers";
import { getTotalCountForFolder } from "../../../util/folderHelpers";
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

export const SaveLink = ({ folder, hideTrigger }: SaveLinkProps) => {
  const { id, name } = folder;
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const { favoriteSharedFolder } = useFavoriteSharedFolder(id);
  const { authenticated } = useContext(AuthContext);
  const toast = useToast();

  const onSaveLink = (name: string) => {
    favoriteSharedFolder();
    hideTrigger();
    setOpen(false);
    toast.create({
      title: t("myNdla.folder.sharing.savedLink", { name }),
    });
  };

  const folderCount = useMemo(() => getTotalCountForFolder(folder), [folder]);

  return (
    <Modal open={open} onOpenChange={() => setOpen(!open)}>
      <ModalTrigger>
        <Button aria-label={t("myNdla.folder.sharing.button.saveLink")} variant="tertiary">
          <Subject />
          {t("myNdla.folder.sharing.button.saveLink")}
        </Button>
      </ModalTrigger>
      {authenticated ? (
        <ModalContent>
          <ModalHeader>
            <ModalTitle>{t("myNdla.folder.sharing.save.header")}</ModalTitle>
            <ModalCloseButton title={t("modal.closeModal")} />
          </ModalHeader>
          <ModalBody>
            <Content>
              <Folder folder={folder} foldersCount={folderCount} link={routes.folder(folder.id)} />
              <MessageBox variant="warning">
                <InformationOutline />
                <Text>{t("myNdla.folder.sharing.save.warning")}</Text>
              </MessageBox>
            </Content>
            <ButtonRow>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                {t("close")}
              </Button>
              <Button variant="primary" onClick={() => onSaveLink(name)}>
                {t("myNdla.folder.sharing.button.saveLink")}
              </Button>
            </ButtonRow>
          </ModalBody>
        </ModalContent>
      ) : (
        <LoginModalContent
          title={t("myNdla.loginSaveFolderLinkPitch")}
          content={<Folder folder={folder} foldersCount={folderCount} link={routes.folder(folder.id)} />}
        />
      )}
    </Modal>
  );
};
