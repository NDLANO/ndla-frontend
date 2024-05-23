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
import styled from "@emotion/styled";
import { IconButtonV2 } from "@ndla/button";
import { spacing } from "@ndla/core";
import { FieldErrorMessage, FieldHelper, FormControl, InputContainer, InputV3, Label } from "@ndla/forms";
import { Spinner } from "@ndla/icons";
import { Cross } from "@ndla/icons/action";
import { Done } from "@ndla/icons/editor";
import { IFolder } from "@ndla/types-backend/myndla-api";
import { getFolder, useAddFolderMutation, useFolders } from "../../containers/MyNdla/folderMutations";
import { useUserAgent } from "../../UserAgentContext";
import useValidationTranslation from "../../util/useValidationTranslation";

interface Props {
  parentId: string;
  onClose?: () => void;
  initialValue?: string;
  onCreate?: (folder: IFolder, parentId: string) => void;
}

const StyledSpinner = styled(Spinner)`
  margin: ${spacing.small};
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.xxsmall};
  padding-right: ${spacing.xsmall};
`;

const NewFolder = ({ parentId, onClose, initialValue = "", onCreate }: Props) => {
  const [name, setName] = useState(initialValue);
  const hasWritten = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
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
  const selectors = useUserAgent();

  useEffect(() => {
    if (selectors?.isMobile) {
      inputRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectors?.isMobile]);

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
    <FormControl id="folder-name" isRequired isInvalid={!!error}>
      <Label visuallyHidden>{t("treeStructure.newFolder.folderName")}</Label>
      <FieldErrorMessage>{error}</FieldErrorMessage>
      <InputContainer>
        <InputV3
          autoComplete="off"
          disabled={loading}
          ref={inputRef}
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
        <Row>
          {!loading ? (
            <>
              {!error && (
                <IconButtonV2
                  variant={"ghost"}
                  colorTheme="light"
                  tabIndex={0}
                  aria-label={t("save")}
                  title={t("save")}
                  size="small"
                  onClick={onSave}
                >
                  <Done />
                </IconButtonV2>
              )}
              <IconButtonV2 aria-label={t("close")} title={t("close")} size="small" variant="ghost" onClick={onClose}>
                <Cross />
              </IconButtonV2>
            </>
          ) : (
            <FieldHelper>
              <StyledSpinner size="normal" aria-label={t("loading")} />
            </FieldHelper>
          )}
        </Row>
      </InputContainer>
    </FormControl>
  );
};

export default memo(NewFolder);
