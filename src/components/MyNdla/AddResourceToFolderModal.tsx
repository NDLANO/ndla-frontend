/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useCallback, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, ModalCloseButton, ModalContent, ModalHeader, ModalTitle, ModalTrigger } from "@ndla/modal";
import { DialogBody, DialogContent, DialogHeader, DialogTitle } from "@ndla/primitives";
import AddResourceToFolder, { ResourceAttributes } from "./AddResourceToFolder";
import ListResource from "./ListResource";
import LoginModalContent from "./LoginModalContent";
import { useFolderResourceMeta } from "../../containers/MyNdla/folderMutations";
import { GQLFolder } from "../../graphqlTypes";
import { AuthContext } from "../AuthenticationContext";
import { DialogCloseButton } from "../DialogCloseButton";

interface Props {
  defaultOpenFolder?: GQLFolder;
  resource: ResourceAttributes;
  children: ReactNode;
}

const AddResourceToFolderModal = ({ resource, children, defaultOpenFolder }: Props) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const { authenticated } = useContext(AuthContext);
  const { meta, loading } = useFolderResourceMeta(resource, {
    skip: !resource || !open,
  });

  const close = useCallback(() => setOpen(false), []);

  return (
    <Modal open={open} onOpenChange={setOpen} modal={!authenticated}>
      <ModalTrigger>{children}</ModalTrigger>
      {authenticated ? (
        <ModalContent>
          <ModalHeader>
            <ModalTitle>{t("myNdla.resource.addToMyNdla")}</ModalTitle>
            <ModalCloseButton />
          </ModalHeader>
          <DialogBody>
            <AddResourceToFolder onClose={close} resource={resource} defaultOpenFolder={defaultOpenFolder} />
          </DialogBody>
        </ModalContent>
      ) : (
        <LoginModalContent
          title={t("myNdla.myPage.loginResourcePitch")}
          content={
            resource && (
              <ListResource
                variant="standalone"
                isLoading={loading}
                id={resource.id.toString()}
                link={resource.path}
                title={meta?.title ?? ""}
                resourceImage={{
                  src: meta?.metaImage?.url ?? "",
                  alt: meta?.metaImage?.alt ?? "",
                }}
                resourceTypes={meta?.resourceTypes ?? []}
              />
            )
          }
        />
      )}
    </Modal>
  );
};

interface ContentProps {
  close: VoidFunction;
  defaultOpenFolder?: GQLFolder;
  resource: ResourceAttributes;
}

export const AddResourceToFolderModalContent = ({ resource, defaultOpenFolder, close }: ContentProps) => {
  const { t } = useTranslation();
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{t("myNdla.resource.addToMyNdla")}</DialogTitle>
        <DialogCloseButton />
      </DialogHeader>
      <DialogBody>
        <AddResourceToFolder onClose={close} resource={resource} defaultOpenFolder={defaultOpenFolder} />
      </DialogBody>
    </DialogContent>
  );
};

export default AddResourceToFolderModal;
