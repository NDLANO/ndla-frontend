/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { DeleteBinLine, ExternalLinkLine } from "@ndla/icons";
import {
  FieldHelper,
  FieldLabel,
  FieldRoot,
  IconButton,
  ListItemContent,
  ListItemHeading,
  ListItemRoot,
  Text,
} from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { linkOverlay } from "@ndla/styled-system/patterns";
import { FolderResourcePicker } from "./FolderResourcePicker";
import { FolderResource } from "./folderTypes";
import { ResourceFormValues } from "./ResourceStepForm";
import config from "../../../../config";

const TextWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "4xsmall",
  },
});

const StyledIconButton = styled(IconButton, {
  base: {
    position: "relative",
  },
});

const PathText = styled(Text, {
  base: {
    overflowWrap: "anywhere",
  },
});

export interface FolderFormValues {
  type: "folder";
  articleId?: number;
  embedUrl: string;
  title: string;
}

export const FolderStepForm = () => {
  const { t } = useTranslation();
  const [resource, setResource] = useState<FolderResource | undefined>(undefined);
  const [focusId, setFocusId] = useState<string | undefined>(undefined);

  const { setValue } = useFormContext<ResourceFormValues>();

  const onResourceSelect = async (selectedResource: FolderResource) => {
    setValue("articleId", selectedResource.articleId, { shouldDirty: true });
    setValue("title", selectedResource.title, { shouldDirty: true });
    setResource(selectedResource);
    setFocusId("remove-resource");
  };

  const onResourceRemove = () => {
    setValue("articleId", undefined, { shouldDirty: true });
    setValue("title", "", { shouldDirty: true });
    setResource(undefined);
    setFocusId("resource-input");
  };

  useEffect(() => {
    if (focusId) {
      document.getElementById(focusId)?.focus();
      setFocusId(undefined);
    }
  }, [focusId]);

  return (
    <FieldRoot>
      <FieldLabel fontWeight="bold">{t("myNdla.learningpath.form.content.folder.label")}</FieldLabel>
      <FieldHelper>{t("myNdla.learningpath.form.content.folder.labelHelper")}</FieldHelper>
      {!resource ? (
        <FolderResourcePicker onResourceSelect={onResourceSelect} />
      ) : (
        <ListItemRoot>
          <ListItemContent>
            <TextWrapper>
              <ListItemHeading asChild consumeCss css={linkOverlay.raw()}>
                <SafeLink to={resource.path} target="_blank">
                  {resource.title}
                  <ExternalLinkLine size="small" />
                </SafeLink>
              </ListItemHeading>
              <PathText textStyle="label.small" color="text.subtle">
                {config.ndlaFrontendDomain}
                {resource.path}
              </PathText>
            </TextWrapper>
            <StyledIconButton
              id="remove-resource"
              aria-label={t("myNdla.learningpath.form.delete")}
              title={t("myNdla.learningpath.form.delete")}
              onClick={onResourceRemove}
              variant="tertiary"
            >
              <DeleteBinLine />
            </StyledIconButton>
          </ListItemContent>
        </ListItemRoot>
      )}
    </FieldRoot>
  );
};
