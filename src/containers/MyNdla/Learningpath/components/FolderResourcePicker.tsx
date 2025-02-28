/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { t } from "i18next";
import { useState, useMemo, useEffect } from "react";
import { createListCollection } from "@ark-ui/react";
import { ArrowDownShortLine } from "@ndla/icons";
import {
  Text,
  InputContainer,
  IconButton,
  ComboboxContentStandalone,
  ListItemRoot,
  ComboboxItem,
  ComboboxRoot,
  ComboboxControl,
  ComboboxInput,
  ComboboxTrigger,
  ComboboxItemText,
  Input,
  Spinner,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { ResourceType } from "@ndla/types-backend/myndla-api";
import { useComboboxTranslations, ContentTypeBadge } from "@ndla/ui";
import { FolderResource } from "./FolderStepForm";
import {
  GQLBreadcrumb,
  GQLFolder,
  GQLFolderResource,
  GQLFolderResourceMetaSearchQuery,
} from "../../../../graphqlTypes";
import { contentTypeMapping } from "../../../../util/getContentType";
import { useFolders, useFolderResourceMetaSearch } from "../../folderMutations";

const StyledHitsWrapper = styled("div", {
  base: {
    textAlign: "start",
    minHeight: "medium",
  },
});

const TextWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "4xsmall",
  },
});

const StyledComboboxContent = styled(ComboboxContentStandalone, {
  base: {
    maxHeight: "surface.medium",
  },
});

const ContentWrapper = styled("div", {
  base: {
    boxShadow: "large",
    padding: "small",
    backgroundColor: "background.default",
    borderRadius: "xsmall",
  },
});

const StyledListItemRoot = styled(ListItemRoot, {
  base: {
    minHeight: "unset",
    textAlign: "start",
  },
});

const StyledComboboxItem = styled(ComboboxItem, {
  base: {
    flexWrap: "wrap",
  },
});

const StyledText = styled(Text, {
  base: {
    lineClamp: "1",
  },
});

const LEGAL_RESOURCE_TYPES: ResourceType[] = ["article"];

type GQLFolderResourceMetaSearch = GQLFolderResourceMetaSearchQuery["folderResourceMetaSearch"][number];
type GQLFolderResourceWithCrumb = GQLFolderResource & {
  uniqueId: string;
  breadcrumbs: GQLBreadcrumb[];
  meta?: GQLFolderResourceMetaSearch;
  contentType?: string;
};

const toKeyedMetaId = (id: string, resourceType: string) => `${resourceType}-${id}`;

const flattenResources = (folders: GQLFolder[]): GQLFolderResourceWithCrumb[] => {
  if (folders.length === 0) return [];

  const resources = folders.flatMap((folder) =>
    folder.resources
      .filter((resource) => LEGAL_RESOURCE_TYPES.includes(resource.resourceType as ResourceType))
      .map<GQLFolderResourceWithCrumb>((resource) => ({
        ...resource,
        breadcrumbs: folder.breadcrumbs,
        uniqueId: `${resource.resourceId}-${resource.resourceType}-${folder.breadcrumbs.map((c) => c.id)}`,
      })),
  );

  return resources.concat(flattenResources(folders.flatMap((folder) => folder.subfolders)));
};

const stitchResourcesWithMeta = (resources: GQLFolderResourceWithCrumb[], metaData: GQLFolderResourceMetaSearch[]) => {
  const keyedMeta = metaData.reduce<Record<string, GQLFolderResourceMetaSearch>>((acc, curr) => {
    acc[toKeyedMetaId(curr.id, curr.type)] = curr;
    return acc;
  }, {});
  return resources.map((resource) => {
    const meta = keyedMeta[toKeyedMetaId(resource.resourceId, resource.resourceType)];
    return {
      ...resource,
      meta,
      contentType: meta?.resourceTypes?.map((type) => contentTypeMapping[type.id]).filter(Boolean)[0],
    };
  });
};

interface ComboboxProps {
  onResourceSelect: (resource: FolderResource) => void;
}

export const FolderResourcePicker = ({ onResourceSelect }: ComboboxProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [stitchedResources, setStitchedResources] = useState<GQLFolderResourceWithCrumb[]>([]);
  const [highlightedValue, setHighligtedValue] = useState<string | null>(null);

  const { folders, loading: foldersLoading, error: foldersError } = useFolders();
  const translations = useComboboxTranslations();

  const resources = useMemo(() => flattenResources(folders), [folders]);

  const resourceSearchInput = useMemo(() => {
    return resources.map((r) => ({ id: r.resourceId, path: r.path, resourceType: r.resourceType }));
  }, [resources]);

  const {
    data,
    loading: folderResourceMetaLoading,
    error: folderResourceMetaError,
  } = useFolderResourceMetaSearch(resourceSearchInput);

  useEffect(() => {
    if (data && resources.length) {
      setStitchedResources(stitchResourcesWithMeta(resources, data));
    }
  }, [data, resources]);

  const filteredResources = useMemo(() => {
    return stitchedResources.filter((res) => res.meta?.title.toLowerCase().includes(inputValue.toLowerCase()));
  }, [inputValue, stitchedResources]);

  const collection = useMemo(
    () =>
      createListCollection({
        items: filteredResources,
        itemToValue: (item) => item.uniqueId,
        itemToString: (item) => item.meta?.title ?? "",
      }),
    [filteredResources],
  );

  if (!!foldersLoading || !!folderResourceMetaLoading) return <Spinner />;

  if (!!foldersError || !!folderResourceMetaError)
    return <Text color="text.error">{t("myNdla.learningpath.form.content.folder.error")}</Text>;

  if (filteredResources.length === 0) {
    return <Text>{t("myNdla.learningpath.form.content.folder.noResources")}</Text>;
  }

  return (
    <ComboboxRoot
      onInputValueChange={(details) => setInputValue(details.inputValue)}
      onOpenChange={(details) => setOpen(details.open)}
      collection={collection}
      onHighlightChange={(details) => setHighligtedValue(details.highlightedValue)}
      translations={translations}
      variant="complex"
      context="composite"
      open={open}
      onValueChange={(details) => {
        const item = details.items[0];
        if (item) {
          onResourceSelect({ path: item.path ?? "", title: item.meta?.title ?? "" });
        }
      }}
      selectionBehavior="preserve"
    >
      <ComboboxControl>
        <InputContainer>
          <ComboboxInput asChild>
            <Input
              id="resource-input"
              placeholder={t("myNdla.learningpath.form.content.folder.placeholder")}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !highlightedValue) e.preventDefault();
              }}
            />
          </ComboboxInput>
        </InputContainer>
        <ComboboxTrigger asChild>
          <IconButton variant="secondary">
            <ArrowDownShortLine />
          </IconButton>
        </ComboboxTrigger>
      </ComboboxControl>
      {open ? (
        <ContentWrapper>
          <StyledHitsWrapper aria-live="assertive">
            {inputValue ? (
              !filteredResources.length ? (
                <Text textStyle="label.small">{`${t("searchPage.noHitsShort", { query: "" })} ${inputValue}`}</Text>
              ) : (
                <Text textStyle="label.small">{`${t("searchPage.resultType.showingSearchPhrase")} "${inputValue}"`}</Text>
              )
            ) : null}
          </StyledHitsWrapper>
          {filteredResources ? (
            <StyledComboboxContent>
              {filteredResources.map((resource, index) => (
                <StyledComboboxItem key={`${resource.id}-${index}`} item={resource} asChild consumeCss>
                  <StyledListItemRoot context="list">
                    <TextWrapper>
                      <ComboboxItemText>{resource.meta?.title}</ComboboxItemText>
                      <StyledText
                        textStyle="label.small"
                        color="text.subtle"
                        aria-label={`${t("breadcrumb.breadcrumb")}: ${resource.breadcrumbs.map((crumb) => crumb.name).join(", ")}`}
                      >
                        {resource.breadcrumbs.map((crumb) => crumb.name).join(" > ")}
                      </StyledText>
                    </TextWrapper>
                    <ContentTypeBadge contentType={resource.contentType ?? resource.resourceType} />
                  </StyledListItemRoot>
                </StyledComboboxItem>
              ))}
            </StyledComboboxContent>
          ) : null}
        </ContentWrapper>
      ) : null}
    </ComboboxRoot>
  );
};
