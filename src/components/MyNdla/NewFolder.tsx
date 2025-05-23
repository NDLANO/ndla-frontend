/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { memo, type RefObject, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useApolloClient } from "@apollo/client";
import { CloseLine, CheckLine } from "@ndla/icons";
import {
  IconButton,
  FieldErrorMessage,
  FieldHelper,
  FieldInput,
  FieldLabel,
  FieldRoot,
  InputContainer,
  Spinner,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { IFolderDTO } from "@ndla/types-backend/myndla-api";
import { getFolder, useAddFolderMutation, useFolders } from "../../mutations/folderMutations";
import useValidationTranslation from "../../util/useValidationTranslation";
import { useToast } from "../ToastContext";

interface Props {
  parentId: string;
  onClose?: () => void;
  initialValue?: string;
  onCreate?: (folder: IFolderDTO, parentId: string) => void;
  ref: RefObject<HTMLInputElement | null>;
}

const StyledSpinner = styled(Spinner, {
  base: {
    margin: "small",
  },
});

const NewFolder = ({ parentId, onClose, initialValue = "", onCreate, ref }: Props) => {
  const [name, setName] = useState(initialValue);
  const hasWritten = useRef(false);
  const toast = useToast();
  const [error, setError] = useState("");
  const { folders } = useFolders();
  const { cache } = useApolloClient();
  const siblings = useMemo(
    () => (parentId !== "folders" ? (getFolder(cache, parentId)?.subfolders ?? []) : folders),
    [parentId, cache, folders],
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
        parentId: parentId === "folders" ? undefined : parentId,
        name,
      },
    });
    const createdFolder = res.data?.addFolder as IFolderDTO | undefined;
    if (createdFolder) {
      onCreate?.({ ...createdFolder, subfolders: [] }, parentId);
      onClose?.();
    }
    if (res.errors?.length) {
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
    <FieldRoot required invalid={!!error}>
      <FieldLabel srOnly>{t("treeStructure.newFolder.folderName")}</FieldLabel>
      <FieldErrorMessage>{error}</FieldErrorMessage>
      <InputContainer>
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
              onClose?.();
            } else if (e.key === "Enter") {
              e.preventDefault();
              onSave();
            }
          }}
        />
        {!loading ? (
          <>
            {!error && (
              <IconButton variant="tertiary" aria-label={t("save")} title={t("save")} onClick={onSave}>
                <CheckLine />
              </IconButton>
            )}
            <IconButton variant="tertiary" aria-label={t("close")} title={t("close")} onClick={onClose}>
              <CloseLine />
            </IconButton>
          </>
        ) : (
          <FieldHelper>
            <StyledSpinner size="small" aria-label={t("loading")} />
          </FieldHelper>
        )}
      </InputContainer>
    </FieldRoot>
  );
};

export default memo(NewFolder);
