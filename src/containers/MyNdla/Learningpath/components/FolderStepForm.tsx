/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { t } from "i18next";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { DeleteBinLine } from "@ndla/icons";
import { FieldHelper, FieldLabel, FieldRoot, IconButton, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { FolderResourcePicker } from "./FolderResourcePicker";
import config from "../../../../config";
import { useFetchOembed } from "../learningpathQueries";
import { ResourceFormValues } from "./ResourceStepForm";

const TextWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "4xsmall",
  },
});

const StyledText = styled(Text, {
  base: {
    textDecoration: "underline",
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
  },
});

export interface FolderResource {
  title: string;
  path: string;
}

export const FolderStepForm = () => {
  const [resource, setResource] = useState<FolderResource | undefined>(undefined);

  const { refetch } = useFetchOembed({ skip: true });
  const { setValue } = useFormContext<ResourceFormValues>();

  const onResourceSelect = async (selectedResource: FolderResource) => {
    const data = await refetch({ url: `${config.ndlaFrontendDomain}${selectedResource.path}` });
    const iframe = data.data?.learningpathStepOembed.html;
    const url = new DOMParser().parseFromString(iframe, "text/html").getElementsByTagName("iframe")[0]?.src ?? "";

    setValue("embedUrl", url, { shouldDirty: true });
    setValue("title", selectedResource.title, { shouldDirty: true });
    setResource(selectedResource);
  };

  return (
    <FieldRoot>
      <FieldLabel fontWeight="bold">{t("myNdla.learningpath.form.content.folder.label")}</FieldLabel>
      <FieldHelper>{t("myNdla.learningpath.form.content.folder.labelHelper")}</FieldHelper>
      {!resource ? (
        <FolderResourcePicker onResourceSelect={onResourceSelect} />
      ) : (
        <ResourceWrapper>
          <TextWrapper>
            <StyledText fontWeight="bold">{resource.title}</StyledText>
            <Text textStyle="label.small" color="text.subtle" css={{ textAlign: "start" }}>
              {config.ndlaFrontendDomain}
              {resource.path}
            </Text>
          </TextWrapper>
          <IconButton
            aria-label={t("myNdla.learningpath.form.delete")}
            title={t("myNdla.learningpath.form.delete")}
            onClick={() => setResource(undefined)}
            variant="tertiary"
          >
            <DeleteBinLine />
          </IconButton>
        </ResourceWrapper>
      )}
    </FieldRoot>
  );
};
