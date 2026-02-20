/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useQuery } from "@apollo/client/react";
import { InformationLine } from "@ndla/icons";
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
import { useState, useContext, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../../components/AuthenticationContext";
import { DialogCloseButton } from "../../../components/DialogCloseButton";
import { Folder } from "../../../components/MyNdla/Folder";
import { LoginModalContent } from "../../../components/MyNdla/LoginModalContent";
import { useToast } from "../../../components/ToastContext";
import { GQLFolder, GQLFoldersPageQuery } from "../../../graphqlTypes";
import { useFavoriteSharedFolder, useUnFavoriteSharedFolder } from "../../../mutations/folder/folderMutations";
import { foldersPageQuery } from "../../../mutations/folder/folderQueries";
import { routes } from "../../../routeHelpers";

interface SaveLinkProps {
  folder: GQLFolder;
}

export const SaveLink = ({ folder }: SaveLinkProps) => {
  const { id, name } = folder;
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const saveRef = useRef<HTMLButtonElement>(null);
  const unsaveRef = useRef<HTMLButtonElement>(null);
  const [favoriteSharedFolder] = useFavoriteSharedFolder();
  const [unfavoriteSharedFolder] = useUnFavoriteSharedFolder();
  const { authenticated } = useContext(AuthContext);
  const toast = useToast();

  const sharedFoldersQuery = useQuery<GQLFoldersPageQuery>(foldersPageQuery, {
    skip: !authenticated,
  });

  const folderLinkIsSaved = useMemo(
    () => sharedFoldersQuery.data?.folders.sharedFolders.some((f) => f.id === folder.id),
    [folder.id, sharedFoldersQuery.data?.folders.sharedFolders],
  );

  const onSaveLink = async (name: string) => {
    await favoriteSharedFolder({
      variables: { folderId: id },
      onCompleted: () => {
        setOpen(false);
        toast.create({ title: t("myNdla.folder.sharing.savedLink", { name }) });
        unsaveRef.current?.focus();
      },
      onError: () => {
        toast.create({ title: t("myNdla.folder.sharing.savedLinkFailed", { name }) });
      },
    });
  };

  const onUnsave = async () => {
    await unfavoriteSharedFolder({
      variables: { folderId: folder.id },
      onCompleted: () => {
        toast.create({ title: t("myNdla.folder.sharing.unSavedLink", { name: folder.name }) });
        saveRef.current?.focus();
      },
      onError: () => toast.create({ title: t("myNdla.folder.sharing.unSavedLinkFailed") }),
    });
  };

  if (folderLinkIsSaved) {
    return (
      <Button onClick={onUnsave} variant="danger" ref={unsaveRef}>
        {t("myNdla.folder.sharing.button.unSaveLink")}
      </Button>
    );
  }

  return (
    <DialogRoot open={open} onOpenChange={(details) => setOpen(details.open)}>
      <DialogTrigger asChild>
        <Button
          aria-label={t("myNdla.folder.sharing.button.saveLink")}
          variant="secondary"
          loading={sharedFoldersQuery.loading}
          ref={saveRef}
        >
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
            <Folder nonInteractive folder={folder} link={routes.folder(folder.id)} />
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
          content={<Folder nonInteractive folder={folder} link={routes.folder(folder.id)} />}
        />
      )}
    </DialogRoot>
  );
};
