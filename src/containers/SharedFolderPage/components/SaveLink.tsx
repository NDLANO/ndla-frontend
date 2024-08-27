/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { BookmarkLine } from "@ndla/icons/action";
import { InformationLine } from "@ndla/icons/common";
import {
  Button,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  MessageBox,
  Text,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { AuthContext } from "../../../components/AuthenticationContext";
import { DialogCloseButton } from "../../../components/DialogCloseButton";
import { Folder } from "../../../components/MyNdla/Folder";
import LoginModalContent from "../../../components/MyNdla/LoginModalContent";
import { useToast } from "../../../components/ToastContext";
import { GQLFolder } from "../../../graphqlTypes";
import { routes } from "../../../routeHelpers";
import { getTotalCountForFolder } from "../../../util/folderHelpers";
import { useFavoriteSharedFolder } from "../../MyNdla/folderMutations";

const ButtonRow = styled("div", {
  base: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: "xsmall",
    paddingBlockStart: "xxlarge",
  },
});

interface SaveLinkProps {
  folder: GQLFolder;
}

export const SaveLink = ({ folder }: SaveLinkProps) => {
  const { id, name } = folder;
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const { favoriteSharedFolder } = useFavoriteSharedFolder(id);
  const { authenticated } = useContext(AuthContext);
  const toast = useToast();

  const onSaveLink = (name: string) => {
    favoriteSharedFolder();
    setOpen(false);
    toast.create({
      title: t("myNdla.folder.sharing.savedLink", { name }),
    });
  };

  const folderCount = useMemo(() => getTotalCountForFolder(folder), [folder]);

  return (
    <DialogRoot open={open} onOpenChange={(details) => setOpen(details.open)}>
      <DialogTrigger asChild>
        <Button aria-label={t("myNdla.folder.sharing.button.saveLink")} variant="tertiary">
          <BookmarkLine />
          {t("myNdla.folder.sharing.button.saveLink")}
        </Button>
      </DialogTrigger>
      {authenticated ? (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("myNdla.folder.sharing.save.header")}</DialogTitle>
            <DialogCloseButton />
          </DialogHeader>
          <DialogBody>
            <Folder variant="standalone" folder={folder} foldersCount={folderCount} link={routes.folder(folder.id)} />
            <MessageBox variant="warning">
              <InformationLine />
              <Text>{t("myNdla.folder.sharing.save.warning")}</Text>
            </MessageBox>
            <ButtonRow>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                {t("close")}
              </Button>
              <Button variant="primary" onClick={() => onSaveLink(name)}>
                {t("myNdla.folder.sharing.button.saveLink")}
              </Button>
            </ButtonRow>
          </DialogBody>
        </DialogContent>
      ) : (
        <LoginModalContent
          title={t("myNdla.loginSaveFolderLinkPitch")}
          content={
            <Folder variant="standalone" folder={folder} foldersCount={folderCount} link={routes.folder(folder.id)} />
          }
        />
      )}
    </DialogRoot>
  );
};
