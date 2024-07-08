/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useCallback, useContext, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, ModalTrigger } from "@ndla/modal";
import CopyFolder from "./CopyFolder";
import { Folder } from "./Folder";
import LoginModalContent from "./LoginModalContent";
import { GQLFolder } from "../../graphqlTypes";
import { routes } from "../../routeHelpers";
import { getTotalCountForFolder } from "../../util/folderHelpers";
import { AuthContext } from "../AuthenticationContext";

interface Props {
  folder: GQLFolder;
  children: ReactNode;
}

const CopyFolderModal = ({ folder, children }: Props) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const { authenticated } = useContext(AuthContext);

  const close = useCallback(() => setOpen(false), []);

  const folderCount = useMemo(() => getTotalCountForFolder(folder), [folder]);

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger>{children}</ModalTrigger>
      {authenticated ? (
        <CopyFolder folder={folder} onClose={close} />
      ) : (
        <LoginModalContent
          title={t("myNdla.loginCopyFolderPitch")}
          content={folder && <Folder folder={folder} foldersCount={folderCount} link={routes.folder(folder.id)} />}
        />
      )}
    </Modal>
  );
};

export default CopyFolderModal;
