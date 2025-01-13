/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { useFormInputProps, usePlateEditor } from "@udecode/plate/react";
import { flip, offset, UseVirtualFloatingOptions } from "@udecode/plate-floating";
import {
  FloatingLinkUrlInput,
  LinkFloatingToolbarState,
  LinkOpenButton,
  submitFloatingLink,
  useFloatingLinkEdit,
  useFloatingLinkEditState,
  useFloatingLinkInsert,
  useFloatingLinkInsertState,
} from "@udecode/plate-link/react";
import { DeleteBinLine, ExternalLinkLine } from "@ndla/icons";
import { Button, FieldInput, FieldLabel, FieldRoot, IconButton } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";

const floatingOptions: UseVirtualFloatingOptions = {
  middleware: [
    offset(12),
    flip({
      fallbackPlacements: ["bottom-end", "top-start", "top-end"],
      padding: 12,
    }),
  ],
  placement: "bottom-start",
};

export interface LinkFloatingToolbarProps {
  state?: LinkFloatingToolbarState;
}

const FloatingContainer = styled("div", {
  base: {
    width: "auto",
    zIndex: "popover",
    background: "surface.default",
    border: "1px solid",
    borderColor: "stroke.info",
    borderRadius: "xsmall",
    padding: "xsmall",
  },
});

const Wrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
  },
});

const ButtonWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "3xsmall",
  },
});

const EditButtonsWrapper = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    gap: "5xsmall",
  },
});

export const FloatingLinkMenu = ({ state }: LinkFloatingToolbarProps) => {
  const { t } = useTranslation();
  const editor = usePlateEditor();
  const insertState = useFloatingLinkInsertState({
    ...state,
    floatingOptions: {
      ...floatingOptions,
      ...state?.floatingOptions,
    },
  });
  const { hidden, props: insertProps, ref: insertRef, textInputProps } = useFloatingLinkInsert(insertState);

  const editState = useFloatingLinkEditState({
    ...state,
    floatingOptions: {
      ...floatingOptions,
      ...state?.floatingOptions,
    },
  });

  const { editButtonProps, props: editProps, ref: editRef, unlinkButtonProps } = useFloatingLinkEdit(editState);
  const inputProps = useFormInputProps({
    preventDefaultOnEnterKeydown: true,
  });

  if (hidden) return null;

  const input = (
    <Wrapper {...inputProps}>
      <FieldRoot>
        <FieldLabel>{t("markdownEditor.link.url")}</FieldLabel>
        <FloatingLinkUrlInput placeholder="Paste link" data-plate-focus asChild>
          <FieldInput />
        </FloatingLinkUrlInput>
      </FieldRoot>
      <FieldRoot>
        <FieldLabel>{t("markdownEditor.link.text")}</FieldLabel>
        <FieldInput placeholder="Text to display" data-plate-focus {...textInputProps} />
      </FieldRoot>
      <ButtonWrapper>
        <Button onClick={() => submitFloatingLink(editor)}>{t("save")}</Button>
      </ButtonWrapper>
    </Wrapper>
  );

  const editContent = editState.isEditing ? (
    input
  ) : (
    <EditButtonsWrapper>
      <Button size="small" {...editButtonProps}>
        Edit link
      </Button>
      <LinkOpenButton>
        <IconButton asChild size="small" variant="tertiary">
          <ExternalLinkLine />
        </IconButton>
      </LinkOpenButton>
      <IconButton variant="danger" size="small" {...unlinkButtonProps}>
        <DeleteBinLine />
      </IconButton>
    </EditButtonsWrapper>
  );

  return (
    <>
      <FloatingContainer ref={insertRef} {...insertProps}>
        {input}
      </FloatingContainer>
      <FloatingContainer ref={editRef} {...editProps}>
        {editContent}
      </FloatingContainer>
    </>
  );
};
