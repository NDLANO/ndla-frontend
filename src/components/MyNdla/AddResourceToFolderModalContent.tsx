/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { DialogBody, DialogContent, DialogHeader, DialogTitle } from "@ndla/primitives";
import { useTranslation } from "react-i18next";
import { GQLFolder } from "../../graphqlTypes";
import { DialogCloseButton } from "../DialogCloseButton";
import AddResourceToFolder, { ResourceAttributes } from "./AddResourceToFolder";

interface Props {
  close: VoidFunction;
  defaultOpenFolder?: GQLFolder;
  resource: ResourceAttributes;
}

export const AddResourceToFolderModalContent = ({ resource, defaultOpenFolder, close }: Props) => {
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
