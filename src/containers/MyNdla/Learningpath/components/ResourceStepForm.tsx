/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FieldHelperText } from "@ark-ui/react";
import { DeleteBinLine } from "@ndla/icons";
import { FieldLabel, FieldRoot, IconButton, Text } from "@ndla/primitives";
import { HStack, styled } from "@ndla/styled-system/jsx";
import { ContentTypeBadge } from "@ndla/ui";
import { ResourcePicker } from "./ResourcePicker";
import { GQLResourceType } from "../../../../graphqlTypes";
import { contentTypeMapping } from "../../../../util/getContentType";

export interface ResourceFormValues {
  type: "resource";
  embedUrl: string;
  title: string;
}

interface ResourceFormProps {
  resource?: ResourceData;
}

export const ResourceStepForm = ({ resource }: ResourceFormProps) => {
  const { t } = useTranslation();
  const [selectedResource, setSelectedResource] = useState<ResourceData | undefined>(resource);
  const { setValue } = useFormContext<ResourceFormValues>();

  const onSelectResource = (resource?: ResourceData) => {
    setSelectedResource(resource);
    setValue("embedUrl", resource?.url ?? "", { shouldDirty: true });
    setValue("title", resource?.title ?? "", { shouldDirty: true });
  };

  return (
    <FieldRoot>
      <FieldLabel fontWeight="bold">{t("myNdla.learningpath.form.content.resource.label")}</FieldLabel>
      <FieldHelperText>{t("myNdla.learningpath.form.content.resource.labelHelper")}</FieldHelperText>
      {!selectedResource ? (
        <ResourcePicker setResource={onSelectResource} />
      ) : (
        <ResourceContent selectedResource={selectedResource} onRemove={() => onSelectResource(undefined)} />
      )}
    </FieldRoot>
  );
};

const TextWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "4xsmall",
    flex: "1",
  },
});

const ResourceWrapper = styled("div", {
  base: {
    display: "flex",
    borderBottom: "1px solid",
    borderColor: "stroke.default",
    padding: "xsmall",
    gap: "medium",
    justifyContent: "space-between",
    boxShadow: "xsmall",
    backgroundColor: "background.default",
  },
});

export interface ResourceData {
  title: string;
  breadcrumbs?: string[];
  resourceTypes?: Pick<GQLResourceType, "id" | "name">[];
  url: string;
}
interface ResourceContentProps {
  onRemove: () => void;
  selectedResource?: ResourceData;
}

export const ResourceContent = ({ onRemove, selectedResource }: ResourceContentProps) => {
  const { t } = useTranslation();

  const contentType = selectedResource?.resourceTypes?.map((type) => contentTypeMapping[type.id]).filter(Boolean)[0];

  return (
    <ResourceWrapper>
      <TextWrapper>
        <Text>{selectedResource?.title}</Text>
        {!!selectedResource?.breadcrumbs && (
          <Text
            textStyle="label.small"
            color="text.subtle"
            css={{ textAlign: "start" }}
            aria-label={`${t("breadcrumb.breadcrumb")}: ${selectedResource.breadcrumbs.join(", ")}`}
          >
            {selectedResource.breadcrumbs.join(" > ")}
          </Text>
        )}
      </TextWrapper>
      <HStack gap="medium">
        <ContentTypeBadge contentType={contentType} />
        <IconButton aria-label={t("myNdla.learningpath.form.delete")} variant="tertiary" onClick={onRemove}>
          <DeleteBinLine />
        </IconButton>
      </HStack>
    </ResourceWrapper>
  );
};
