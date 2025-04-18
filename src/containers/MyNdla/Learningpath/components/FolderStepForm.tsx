/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { t } from "i18next";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { DeleteBinLine, ExternalLinkLine } from "@ndla/icons";
import { FieldHelper, FieldLabel, FieldRoot, IconButton, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { linkOverlay } from "@ndla/styled-system/patterns";
import { FolderResourcePicker } from "./FolderResourcePicker";
import config from "../../../../config";
import { useFetchOembed } from "../learningpathQueries";
import { FolderResource } from "./folderTypes";
import { ResourceFormValues } from "./ResourceStepForm";
import { StepSafeLink } from "./StepSafeLink";

const TextWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "4xsmall",
  },
});

const ResourceWrapper = styled("div", {
  base: {
    display: "flex",
    borderBottom: "1px solid",
    borderColor: "stroke.subtle",
    padding: "xsmall",
    gap: "medium",
    justifyContent: "space-between",
    backgroundColor: "background.default",
    position: "relative",
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
  embedUrl: string;
  title: string;
}

export const FolderStepForm = () => {
  const [resource, setResource] = useState<FolderResource | undefined>(undefined);
  const [focusId, setFocusId] = useState<string | undefined>(undefined);

  const { refetch } = useFetchOembed({ skip: true });
  const { setValue } = useFormContext<ResourceFormValues>();

  const onResourceSelect = async (selectedResource: FolderResource) => {
    const data = await refetch({ url: `${config.ndlaFrontendDomain}${selectedResource.path}` });
    const iframe = data.data?.learningpathStepOembed.html;
    const url = new DOMParser().parseFromString(iframe, "text/html").getElementsByTagName("iframe")[0]?.src ?? "";

    setValue("embedUrl", url, { shouldDirty: true });
    setValue("title", selectedResource.title, { shouldDirty: true });
    setResource(selectedResource);
    setFocusId("remove-resource");
  };

  const onResourceRemove = () => {
    setValue("embedUrl", "", { shouldDirty: true });
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
        <ResourceWrapper>
          <TextWrapper>
            <StepSafeLink to={resource.path} target="_blank" css={linkOverlay.raw()}>
              <Text fontWeight="bold">
                {resource.title}
                <ExternalLinkLine size="small" />
              </Text>
            </StepSafeLink>
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
        </ResourceWrapper>
      )}
    </FieldRoot>
  );
};
