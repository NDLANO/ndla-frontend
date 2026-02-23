/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { usePopoverContext } from "@ark-ui/react";
import { FolderDTO } from "@ndla/types-backend/myndla-api";
import { GQLFolder } from "../../graphqlTypes";
import { useAddFolderMutation } from "../../mutations/folder/folderMutations";
import { useToast } from "../ToastContext";
import { FolderForm, FolderFormValues } from "./FolderForm";
import { ROOT_FOLDER_ID } from "./FolderSelect";

interface Props {
  parentFolder: GQLFolder;
  siblings: GQLFolder[];
  onCreate?: (folder: FolderDTO) => void;
}

export const NewFolder = ({ parentFolder, siblings, onCreate }: Props) => {
  const toast = useToast();
  const { setOpen } = usePopoverContext();
  const [addFolder, { loading }] = useAddFolderMutation();

  const onSave = async (values: FolderFormValues) => {
    const res = await addFolder({
      variables: {
        parentId: parentFolder.id === ROOT_FOLDER_ID ? undefined : parentFolder.id,
        name: values.name,
      },
    });
    const createdFolder = res.data?.addFolder as FolderDTO | undefined;
    if (createdFolder) {
      onCreate?.({ ...createdFolder, subfolders: [] });
      setOpen(false);
    }
    if (res.error) {
      toast.create({ title: "myNdla.folder.toast.folderCreatedFailed" });
    }
  };

  return (
    <FolderForm onSave={onSave} onClose={() => setOpen(false)} siblings={siblings} loading={loading} context="simple" />
  );
};
