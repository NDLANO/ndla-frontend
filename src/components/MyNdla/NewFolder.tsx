/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useApolloClient } from "@apollo/client";
import { IFolder } from "@ndla/types-backend/myndla-api";
import { FolderInput } from "@ndla/ui";
import { getFolder, useAddFolderMutation, useFolders } from "../../containers/MyNdla/folderMutations";
import useValidationTranslation from "../../util/useValidationTranslation";

interface Props {
  parentId: string;
  onClose?: () => void;
  initialValue?: string;
  onCreate?: (folder: IFolder, parentId: string) => void;
}

const NewFolder = ({ parentId, onClose, initialValue = "", onCreate }: Props) => {
  const [name, setName] = useState(initialValue);
  const hasWritten = useRef(false);
  const [error, setError] = useState("");
  const { folders } = useFolders();
  const { cache } = useApolloClient();
  const siblings = useMemo(
    () => (parentId !== "folders" ? getFolder(cache, parentId)?.subfolders ?? [] : folders),
    [parentId, cache, folders],
  );
  const siblingNames = siblings.map((sib) => sib.name.toLowerCase());
  const { addFolder, loading } = useAddFolderMutation();
  const { t } = useTranslation();
  const { validationT } = useValidationTranslation();

  const onSave = async () => {
    if (error) {
      return;
    }
    const res = await addFolder({
      variables: {
        parentId: parentId === "folders" ? undefined : parentId,
        name,
      },
    });
    const createdFolder = res.data?.addFolder as IFolder | undefined;
    if (createdFolder) {
      onCreate?.({ ...createdFolder, subfolders: [] }, parentId);
      onClose?.();
    }
  };

  useEffect(() => {
    if (!hasWritten.current) {
      hasWritten.current = true;
      return;
    }
    if (name.length === 0) {
      setError(validationT({ field: "name", type: "required" }));
    } else if (siblingNames.includes(name.toLowerCase())) {
      setError(validationT({ type: "notUnique" }));
    } else if (name.length > 64) {
      setError(
        validationT({
          type: "maxLength",
          field: "name",
          vars: { count: 64 },
        }),
      );
    } else {
      setError("");
    }
  }, [name, validationT, siblingNames]);

  return (
    <FolderInput
      // Necessary to move focus from new folder-button to input on click
      // eslint-disable-next-line jsx-a11y/no-autofocus
      autoFocus
      name="name"
      label={t("treeStructure.newFolder.folderName")}
      placeholder={t("treeStructure.newFolder.placeholder")}
      loading={loading}
      onClose={onClose}
      onSave={onSave}
      error={error}
      value={name}
      onChange={(e) => {
        if (!loading) {
          setName(e.currentTarget.value);
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          onClose?.();
        } else if (e.key === "Enter") {
          e.preventDefault();
          onSave();
        }
      }}
    />
  );
};

export default memo(NewFolder);
