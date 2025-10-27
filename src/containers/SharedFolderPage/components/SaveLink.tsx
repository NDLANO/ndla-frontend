/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { BookmarkLine, InformationLine } from "@ndla/icons";
import {
  Button,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  MessageBox,
  Text,
} from "@ndla/primitives";
import { AuthContext } from "../../../components/AuthenticationContext";
import { DialogCloseButton } from "../../../components/DialogCloseButton";
import { Folder } from "../../../components/MyNdla/Folder";
import { LoginModalContent } from "../../../components/MyNdla/LoginModalContent";
import { useToast } from "../../../components/ToastContext";
import { GQLFolder } from "../../../graphqlTypes";
import { useFavoriteSharedFolder } from "../../../mutations/folder/folderMutations";
import { routes } from "../../../routeHelpers";
import { getTotalCountForFolder } from "../../../util/folderHelpers";

interface SaveLinkProps {
  folder: GQLFolder;
}

export const SaveLink = ({ folder }: SaveLinkProps) => {
  const { id, name } = folder;
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const [favoriteSharedFolder] = useFavoriteSharedFolder();
  const { authenticated } = useContext(AuthContext);
  const toast = useToast();

  const onSaveLink = async (name: string) => {
    const res = await favoriteSharedFolder({ variables: { folderId: id } });
    if (!res.error) {
      setOpen(false);
      toast.create({
        title: t("myNdla.folder.sharing.savedLink", { name }),
      });
    } else {
      toast.create({
        title: t("myNdla.folder.sharing.savedLinkFailed", { name }),
      });
    }
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
            <Folder
              context="standalone"
              variant="subtle"
              nonInteractive
              folder={folder}
              foldersCount={folderCount}
              link={routes.folder(folder.id)}
            />
            <MessageBox variant="warning">
              <InformationLine />
              <Text>{t("myNdla.folder.sharing.save.warning")}</Text>
            </MessageBox>
          </DialogBody>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              {t("close")}
            </Button>
            <Button variant="primary" onClick={() => onSaveLink(name)}>
              {t("myNdla.folder.sharing.button.saveLink")}
            </Button>
          </DialogFooter>
        </DialogContent>
      ) : (
        <LoginModalContent
          title={t("myNdla.loginSaveFolderLinkPitch")}
          content={
            <Folder
              context="standalone"
              variant="subtle"
              nonInteractive
              folder={folder}
              foldersCount={folderCount}
              link={routes.folder(folder.id)}
            />
          }
        />
      )}
    </DialogRoot>
  );
};
