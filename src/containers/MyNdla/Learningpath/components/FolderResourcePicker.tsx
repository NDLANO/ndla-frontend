/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { t } from "i18next";
import keyBy from "lodash/keyBy";
import { useState, useMemo, useEffect } from "react";
import { ComboboxInputValueChangeDetails, createListCollection } from "@ark-ui/react";
import { CloseLine, ArrowDownShortLine } from "@ndla/icons";
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
  ComboboxClearTrigger,
  ComboboxTrigger,
  ComboboxItemText,
  Input,
  Spinner,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { useComboboxTranslations, ContentTypeBadge } from "@ndla/ui";
import { FolderResource } from "./FolderStepForm";
import { GQLBreadcrumb, GQLFolder, GQLFolderResource } from "../../../../graphqlTypes";
import { contentTypeMapping } from "../../../../util/getContentType";
import { useFolders, useFolderResourceMetaSearch } from "../../folderMutations";

const HitsText = styled(Text, {
  base: {
    marginBlockStart: "3xsmall",
    textAlign: "start",
  },
});

const TextWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "4xsmall",
    flex: "1",
  },
});

const StyledListItemRoot = styled(ListItemRoot, {
  base: {
    minHeight: "unset",
    textAlign: "start",
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
    flexWrap: "wrap",
  },
});

const LEGAL_RESOURCE_TYPES = ["article", "multidisciplinary", "topic"];

type GQLFolderResourceWithCrumb = GQLFolderResource & { breadcrumb: GQLBreadcrumb[] };

const flattenFolderResources = (folders: GQLFolder[]): GQLFolderResourceWithCrumb[] => {
  const results: GQLFolderResourceWithCrumb[] = folders
    .flatMap((folder) =>
      folder.resources
        .filter((resource) => LEGAL_RESOURCE_TYPES.includes(resource.resourceType))
        .map<GQLFolderResourceWithCrumb>((resource) => ({ ...resource, breadcrumb: folder.breadcrumbs })),
    )
    .flat();

  folders.forEach((folder) => results.push(...flattenFolderResources(folder.subfolders)));

  return results;
};

interface ComboboxProps {
  onResourceSelect: (resource: FolderResource) => void;
}

export const FolderResourcePicker = ({ onResourceSelect }: ComboboxProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [filteredResources, setFilteredResources] = useState<GQLFolderResourceWithCrumb[] | undefined>(undefined);
  const [highlightedValue, setHighligtedValue] = useState<string | null>(null);

  const { folders } = useFolders();
  const resources = useMemo(() => flattenFolderResources(folders), [folders]);

  const { data, loading } = useFolderResourceMetaSearch(
    resources.map((r) => ({
      id: r.resourceId,
      path: r.path,
      resourceType: r.resourceType,
    })),
  );

  const translations = useComboboxTranslations();

  const keyedData = useMemo(() => keyBy(data ?? [], (resource) => `${resource.type}-${resource.id}`), [data]);

  const collection = useMemo(
    () =>
      createListCollection({
        items: filteredResources ?? [],
        itemToValue: (item) => item?.id,
        itemToString: (item) => keyedData[`${item?.resourceType}-${item?.resourceId}`]?.title ?? item?.id,
      }),
    [filteredResources, keyedData],
  );

  const handleChange = (e: ComboboxInputValueChangeDetails) => {
    const filtered = resources.filter((item) =>
      keyedData[`${item.resourceType}-${item.resourceId}`]?.title.toLowerCase().includes(e.inputValue.toLowerCase()),
    );
    setFilteredResources(filtered);
    setInputValue(e.inputValue);
  };

  useEffect(() => {
    if (!filteredResources && !!resources.length) {
      setFilteredResources(resources);
    }
  }, [filteredResources, resources]);

  return (
    <ComboboxRoot
      onInputValueChange={handleChange}
      onOpenChange={(details) => setOpen(details.open)}
      onHighlightChange={(details) => setHighligtedValue(details.highlightedValue)}
      collection={collection}
      translations={translations}
      variant="complex"
      context="composite"
      open={open}
      selectionBehavior="preserve"
    >
      <ComboboxControl>
        <InputContainer>
          <ComboboxInput asChild>
            <Input
              placeholder={t("myNdla.learningpath.form.content.folder.placeholder")}
              onKeyDown={(e) => {
                if (e.key === "Enter" && highlightedValue) {
                  if (highlightedValue) {
                    const resource = filteredResources?.find((item) => item.id === highlightedValue);
                    const metaData = keyedData[`${resource?.resourceType}-${resource?.resourceId}`];
                    onResourceSelect({
                      path: resource?.path ?? "",
                      title: metaData?.title ?? "",
                    });
                  }
                }
              }}
            />
          </ComboboxInput>
        </InputContainer>
        <ComboboxClearTrigger asChild>
          <IconButton variant="clear">
            <CloseLine />
          </IconButton>
        </ComboboxClearTrigger>
        <ComboboxTrigger asChild>
          <IconButton variant="secondary">
            <ArrowDownShortLine />
          </IconButton>
        </ComboboxTrigger>
      </ComboboxControl>
      {open ? (
        <ContentWrapper>
          {inputValue ? (
            <HitsText textStyle="label.small">
              {t("searchPage.resultType.showingSearchPhrase")} {inputValue}
            </HitsText>
          ) : null}
          {loading ? (
            <Spinner />
          ) : filteredResources?.length ? (
            <StyledComboboxContent>
              {filteredResources?.map((resource) => {
                const metaData = keyedData[`${resource.resourceType}-${resource.resourceId}`];
                const contentType = metaData?.resourceTypes
                  ?.map((type) => contentTypeMapping[type.id])
                  .filter(Boolean)[0];

                return (
                  <StyledComboboxItem
                    key={resource?.id}
                    item={resource}
                    onClick={() => {
                      onResourceSelect({
                        title: metaData?.title ?? "",
                        path: resource.path,
                      });
                    }}
                    className="peer"
                    asChild
                    consumeCss
                  >
                    <StyledListItemRoot context="list">
                      <TextWrapper>
                        <ComboboxItemText>{metaData?.title}</ComboboxItemText>
                        <Text
                          textStyle="label.small"
                          color="text.subtle"
                          css={{ textAlign: "start" }}
                          aria-label={`${t("breadcrumb.breadcrumb")}: ${resource.breadcrumb.map((crumb) => crumb.name).join(", ")}`}
                        >
                          {resource.breadcrumb.map((crumb) => crumb.name).join(" > ")}
                        </Text>
                      </TextWrapper>
                      <ContentTypeBadge contentType={contentType ?? resource.resourceType} />
                    </StyledListItemRoot>
                  </StyledComboboxItem>
                );
              })}
            </StyledComboboxContent>
          ) : null}
        </ContentWrapper>
      ) : null}
    </ComboboxRoot>
  );
};
