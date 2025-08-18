/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { DeleteBinLine, ExternalLinkLine } from "@ndla/icons";
import { FieldLabel, FieldHelper, FieldRoot, IconButton, Text } from "@ndla/primitives";
import { HStack, styled } from "@ndla/styled-system/jsx";
import { linkOverlay } from "@ndla/styled-system/patterns";
import { ContentTypeBadge } from "@ndla/ui";
import { ResourceData } from "./folderTypes";
import { ResourcePicker } from "./ResourcePicker";
import { StepSafeLink } from "./StepSafeLink";
import config from "../../../../config";
import { contentTypeMapping } from "../../../../util/getContentType";

export interface ResourceFormValues {
  type: "resource";
  embedUrl: string;
  articleId?: number;
  title: string;
}

interface ResourceFormProps {
  resource?: ResourceData;
}

export const ResourceStepForm = ({ resource }: ResourceFormProps) => {
  const { t } = useTranslation();
  const [selectedResource, setSelectedResource] = useState<ResourceData | undefined>(resource);
  const [focusId, setFocusId] = useState<string | undefined>(undefined);
  const { setValue } = useFormContext<ResourceFormValues>();

  const onSelectResource = (resource: ResourceData) => {
    setSelectedResource(resource);
    setValue("articleId", resource.articleId, { shouldDirty: true });
    setValue("title", resource.title, { shouldDirty: true });
    setFocusId("remove-resource");
  };

  const onRemove = () => {
    setSelectedResource(undefined);
    setValue("embedUrl", "", { shouldDirty: true });
    setValue("title", "", { shouldDirty: true });
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
      <FieldLabel fontWeight="bold">{t("myNdla.learningpath.form.content.resource.label")}</FieldLabel>
      <FieldHelper>{t("myNdla.learningpath.form.content.resource.labelHelper")}</FieldHelper>
      {!selectedResource ? (
        <ResourcePicker setResource={onSelectResource} />
      ) : (
        <ResourceContent selectedResource={selectedResource} onRemove={onRemove} />
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
    flexWrap: "wrap",
    borderBottom: "1px solid",
    borderColor: "stroke.default",
    padding: "xsmall",
    gap: "medium",
    justifyContent: "space-between",
    boxShadow: "xsmall",
    backgroundColor: "background.default",
    position: "relative",
  },
});

const StyledHStack = styled(HStack, {
  base: {
    flexWrap: "wrap",
  },
});

const CrumbText = styled(Text, {
  base: {
    overflowWrap: "anywhere",
  },
});

const StyledIconButton = styled(IconButton, {
  base: {
    position: "relative",
  },
});

interface ResourceContentProps {
  onRemove: () => void;
  selectedResource: ResourceData;
}

export const ResourceContent = ({ onRemove, selectedResource }: ResourceContentProps) => {
  const { t } = useTranslation();

  const contentType = selectedResource.resourceTypes?.map((type) => contentTypeMapping[type.id]).filter(Boolean)[0];

  return (
    <ResourceWrapper>
      <TextWrapper>
        <StepSafeLink
          to={`${config.ndlaFrontendDomain}/article/${selectedResource.articleId}`}
          target="_blank"
          css={linkOverlay.raw()}
        >
          <Text fontWeight="bold">
            {selectedResource.title}
            <ExternalLinkLine size="small" />
          </Text>
        </StepSafeLink>
        {!!selectedResource.breadcrumbs && (
          <CrumbText
            textStyle="label.small"
            color="text.subtle"
            css={{ textAlign: "start" }}
            aria-label={`${t("breadcrumb.breadcrumb")}: ${selectedResource.breadcrumbs.join(", ")}`}
          >
            {selectedResource.breadcrumbs.join(" > ")}
          </CrumbText>
        )}
      </TextWrapper>
      <StyledHStack gap="medium">
        {!!contentType && <ContentTypeBadge contentType={contentType} />}
        <StyledIconButton
          id="remove-resource"
          aria-label={t("myNdla.learningpath.form.delete")}
          title={t("myNdla.learningpath.form.delete")}
          variant="tertiary"
          onClick={onRemove}
        >
          <DeleteBinLine />
        </StyledIconButton>
      </StyledHStack>
    </ResourceWrapper>
  );
};
