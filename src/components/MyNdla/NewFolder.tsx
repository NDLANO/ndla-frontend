/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useApolloClient } from "@apollo/client/react";
import { usePopoverContext } from "@ark-ui/react";
import { FieldErrorMessage, FieldInput, FieldLabel, FieldRoot, Button, FieldHelper } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { IFolderDTO } from "@ndla/types-backend/myndla-api";
import { GQLFolder } from "../../graphqlTypes";
import { getFolder, useAddFolderMutation, useFolders } from "../../mutations/folderMutations";
import useValidationTranslation from "../../util/useValidationTranslation";
import { useToast } from "../ToastContext";

const FolderContainer = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
  },
});

const ButtonsWrapper = styled("div", {
  base: {
    alignSelf: "flex-end",
    display: "flex",
    gap: "3xsmall",
  },
});

interface Props {
  parentFolder: GQLFolder;
  initialValue?: string;
  onCreate?: (folder: IFolderDTO) => void;
}

const NewFolder = ({ parentFolder, initialValue = "", onCreate }: Props) => {
  const [name, setName] = useState(initialValue);
  const hasWritten = useRef(false);
  const toast = useToast();
  const [error, setError] = useState("");
  const { folders } = useFolders();
  const { cache } = useApolloClient();
  const { setOpen } = usePopoverContext();
  const ref = useRef<HTMLInputElement>(null);
  const siblings = useMemo(
    () => (parentFolder.id !== "folders" ? (getFolder(cache, parentFolder.id)?.subfolders ?? []) : folders),
    [parentFolder?.id, cache, folders],
  );
  const siblingNames = siblings.map((sib) => sib.name.toLowerCase());
  const [addFolder, { loading }] = useAddFolderMutation();
  const { t } = useTranslation();
  const { validationT } = useValidationTranslation();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [ref]);

  const onSave = async () => {
    if (error) {
      return;
    }
    const res = await addFolder({
      variables: {
        parentId: parentFolder.id === "folders" ? undefined : parentFolder.id,
        name,
      },
    });
    const createdFolder = res.data?.addFolder as IFolderDTO | undefined;
    if (createdFolder) {
      onCreate?.({ ...createdFolder, subfolders: [] });
      setOpen(false);
    }
    if (res.error) {
      toast.create({ title: "myNdla.folder.toast.folderCreatedFailed" });
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
    <FolderContainer>
      <FieldRoot required invalid={!!error}>
        <FieldLabel>{t("treeStructure.newFolder.folderName")}</FieldLabel>
        <FieldHelper>{t("treeStructure.newFolder.placedUnder", { folderName: parentFolder.name })}</FieldHelper>
        <FieldErrorMessage>{error}</FieldErrorMessage>
        <FieldInput
          autoComplete="off"
          disabled={loading}
          ref={ref}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          placeholder={t("treeStructure.newFolder.placeholder")}
          onChange={(e) => {
            if (!loading) {
              setName(e.currentTarget.value);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.preventDefault();
              setOpen(false);
            } else if (e.key === "Enter") {
              e.preventDefault();
              onSave();
            }
          }}
        />
      </FieldRoot>
      <ButtonsWrapper>
        <Button onClick={() => setOpen(false)} variant="secondary">
          {t("cancel")}
        </Button>
        <Button onClick={onSave} loading={loading}>
          {t("save")}
        </Button>
      </ButtonsWrapper>
    </FolderContainer>
  );
};

export default memo(NewFolder);
