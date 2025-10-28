/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TFunction } from "i18next";
import { useState, useMemo, useEffect } from "react";
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
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { ResourceType } from "@ndla/types-backend/myndla-api";
import { useComboboxTranslations } from "@ndla/ui";
import { FolderResource } from "./folderTypes";
import { TraitsContainer } from "../../../../components/TraitsContainer";
import {
  GQLBreadcrumb,
  GQLFolder,
  GQLFolderResource,
  GQLFolderResourceMetaSearchQuery,
} from "../../../../graphqlTypes";
import { useFolders, useFolderResourceMetaSearch } from "../../../../mutations/folder/folderQueries";
import { contentTypeMapping } from "../../../../util/getContentType";
import { getListItemTraits } from "../../../../util/listItemTraits";

const StyledHitsWrapper = styled("div", {
  base: {
    textAlign: "start",
    minHeight: "medium",
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

const StyledComboboxItem = styled(ComboboxItem, {
  base: {
    minHeight: "unset",
    textAlign: "start",
    flexDirection: "column",
    alignItems: "flex-start",
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
    const contentType = meta?.resourceTypes?.map((type) => contentTypeMapping[type.id]).filter(Boolean)[0];
    const traits = getListItemTraits(
      {
        contentType,
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
      contentType: meta?.resourceTypes?.map((type) => contentTypeMapping[type.id]).filter(Boolean)[0],
    };
  });
};

interface ComboboxProps {
  onResourceSelect: (resource: FolderResource) => void;
}

export const FolderResourcePicker = ({ onResourceSelect }: ComboboxProps) => {
  const { t } = useTranslation();
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
                <StyledComboboxItem key={`${resource.id}-${index}`} item={resource} asChild>
                  <ListItemRoot context="list">
                    <ComboboxItemText>{resource.meta?.title}</ComboboxItemText>
                    <StyledText
                      textStyle="label.small"
                      color="text.subtle"
                      aria-label={`${t("breadcrumb.breadcrumb")}: ${resource.breadcrumbs.map((crumb) => crumb.name).join(", ")}`}
                    >
                      {resource.breadcrumbs.map((crumb) => crumb.name).join(" › ")}
                    </StyledText>
                    <TraitsContainer>
                      {resource.traits?.map((trait) => (
                        <Badge key={`${resource.id}-${trait}`}>{trait}</Badge>
                      ))}
                    </TraitsContainer>
                  </ListItemRoot>
                </StyledComboboxItem>
              ))}
            </StyledComboboxContent>
          ) : null}
        </ContentWrapper>
      ) : null}
    </ComboboxRoot>
  );
};
