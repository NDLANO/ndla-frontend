/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TFunction } from "i18next";
import { useState, useMemo, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { createListCollection } from "@ark-ui/react";
import { ArrowDownShortLine } from "@ndla/icons";
import {
  Badge,
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
  ComboboxList,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { ResourceType } from "@ndla/types-backend/myndla-api";
import { BadgesContainer, useComboboxTranslations } from "@ndla/ui";
import { FolderResource } from "./folderTypes";
import {
  GQLBreadcrumb,
  GQLFolder,
  GQLFolderResource,
  GQLFolderResourceMetaSearchQuery,
} from "../../../../graphqlTypes";
import { useFolders, useFolderResourceMetaSearch } from "../../../../mutations/folder/folderQueries";
import { getListItemTraits } from "../../../../util/listItemTraits";
import { scrollToIndexFn } from "../../../../util/scrollToIndexFn";

const StyledHitsWrapper = styled("div", {
  base: {
    marginBlockStart: "3xsmall",
    textAlign: "start",
  },
});

const StyledComboboxContent = styled(ComboboxContentStandalone, {
  base: {
    overflowY: "unset",
    maxHeight: "surface.medium",
    gap: "xxsmall",
  },
});

const StyledComboboxList = styled(ComboboxList, {
  base: {
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    gap: "xxsmall",
  },
});

const StyledComboboxItem = styled(ComboboxItem, {
  base: {
    minHeight: "unset",
    textAlign: "start",
    flexDirection: "column",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: "4xsmall",
  },
});

const StyledBadgesContainer = styled(BadgesContainer, {
  base: {
    marginBlockStart: "xsmall",
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
  traits?: string[];
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

const stitchResourcesWithMeta = (
  resources: GQLFolderResourceWithCrumb[],
  metaData: GQLFolderResourceMetaSearch[],
  t: TFunction,
) => {
  const keyedMeta = metaData.reduce<Record<string, GQLFolderResourceMetaSearch>>((acc, curr) => {
    acc[toKeyedMetaId(curr.id, curr.type)] = curr;
    return acc;
  }, {});
  return resources.map((resource) => {
    const meta = keyedMeta[toKeyedMetaId(resource.resourceId, resource.resourceType)];
    const traits = getListItemTraits(
      {
        resourceTypes: meta?.resourceTypes,
        resourceType: resource.resourceType,
        traits: meta?.__typename === "ArticleFolderResourceMeta" ? meta.traits : undefined,
      },
      t,
    );
    return {
      ...resource,
      meta,
      traits,
    };
  });
};

interface ComboboxProps {
  onResourceSelect: (resource: FolderResource) => void;
}

// TODO: This should be refactored, and possible share a lot of code with ResourcePicker
export const FolderResourcePicker = ({ onResourceSelect }: ComboboxProps) => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState<string>("");
  const [stitchedResources, setStitchedResources] = useState<GQLFolderResourceWithCrumb[]>([]);
  const [highlightedValue, setHighligtedValue] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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
      setStitchedResources(stitchResourcesWithMeta(resources, data, t));
    }
  }, [data, resources, t]);

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

  if (stitchedResources.length === 0) {
    return <Text>{t("myNdla.learningpath.form.content.folder.noResources")}</Text>;
  }

  return (
    <ComboboxRoot
      ids={{ input: "resource-input" }}
      onInputValueChange={(details) => setInputValue(details.inputValue)}
      collection={collection}
      onHighlightChange={(details) => setHighligtedValue(details.highlightedValue)}
      scrollToIndexFn={(details) => scrollToIndexFn(contentRef, details.index)}
      translations={translations}
      variant="complex"
      context="standalone"
      positioning={{ strategy: "fixed" }}
      onValueChange={(details) => {
        const item = details.items[0];
        if (item?.resourceType === "article") {
          onResourceSelect({
            articleId: parseInt(item.resourceId),
            path: item.path ?? "",
            title: item.meta?.title ?? "",
          });
        }
      }}
      selectionBehavior="preserve"
    >
      <ComboboxControl>
        <InputContainer>
          <ComboboxInput
            asChild
            placeholder={t("myNdla.learningpath.form.content.folder.placeholder")}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !highlightedValue) e.preventDefault();
            }}
          >
            <Input />
          </ComboboxInput>
        </InputContainer>
        <ComboboxTrigger asChild>
          <IconButton variant="secondary">
            <ArrowDownShortLine />
          </IconButton>
        </ComboboxTrigger>
      </ComboboxControl>
      <StyledComboboxContent ref={contentRef} tabIndex={-1}>
        <StyledHitsWrapper aria-live="assertive">
          {inputValue ? (
            !filteredResources.length ? (
              <Text textStyle="label.small">{`${t("searchPage.noHitsShort", { query: "" })} ${inputValue}`}</Text>
            ) : (
              <Text textStyle="label.small">{`${t("searchPage.resultType.showingSearchPhrase")} "${inputValue}"`}</Text>
            )
          ) : null}
        </StyledHitsWrapper>
        <StyledComboboxList tabIndex={-1}>
          {filteredResources.map((resource) => (
            <StyledComboboxItem key={resource.uniqueId} item={resource} asChild>
              <ListItemRoot>
                <ComboboxItemText>{resource.meta?.title}</ComboboxItemText>
                <StyledText
                  textStyle="label.small"
                  color="text.subtle"
                  aria-label={`${t("breadcrumb.breadcrumb")}: ${resource.breadcrumbs.map((crumb) => crumb.name).join(", ")}`}
                >
                  {resource.breadcrumbs.map((crumb) => crumb.name).join(" › ")}
                </StyledText>
                <StyledBadgesContainer>
                  {resource.traits?.map((trait) => (
                    <Badge size="small" key={`${resource.id}-${trait}`}>
                      {trait}
                    </Badge>
                  ))}
                </StyledBadgesContainer>
              </ListItemRoot>
            </StyledComboboxItem>
          ))}
        </StyledComboboxList>
      </StyledComboboxContent>
    </ComboboxRoot>
  );
};
