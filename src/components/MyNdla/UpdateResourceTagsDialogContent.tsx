/**
 * Copyright (c) 2026-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { createListCollection } from "@ark-ui/react";
import { ArrowDownShortLine, CheckLine, CloseLine } from "@ndla/icons";
import {
  Button,
  ComboboxContent,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxItemText,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  IconButton,
  Input,
  InputContainer,
} from "@ndla/primitives";
import { HStack, styled } from "@ndla/styled-system/jsx";
import {
  TagSelectorClearTrigger,
  TagSelectorControl,
  TagSelectorInput,
  TagSelectorLabel,
  TagSelectorRoot,
  TagSelectorTrigger,
  useTagSelectorTranslations,
} from "@ndla/ui";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { GQLMyNdlaResource, GQLUpdateResourceTagsQuery, GQLUpdateResourceTagsQueryVariables } from "../../graphqlTypes";
import { useUpdateMyNdlaResourceMutation } from "../../mutations/folder/folderMutations";
import { useDebounce } from "../../util/useDebounce";
import { DialogCloseButton } from "../DialogCloseButton";
import { useToast } from "../ToastContext";

interface Props {
  resource: GQLMyNdlaResource;
  onClose: VoidFunction;
}

const StyledComboboxContent = styled(ComboboxContent, {
  base: {
    display: "flex",
    maxHeight: "320px",
    overflow: "hidden",
  },
});

const queryDef = gql`
  query updateResourceTags {
    myNdlaResourceTags
  }
`;

const shouldUpdateMyNdlaResource = (storedResource: GQLMyNdlaResource, selectedTags: string[]) => {
  if (storedResource.tags.length !== selectedTags.length) return true;
  const storedSet = new Set(storedResource.tags);
  return !selectedTags.every((tag) => storedSet.has(tag));
};

export const UpdateResourceTagsDialogContent = ({ onClose, resource }: Props) => {
  const { t } = useTranslation();
  const [selectedTags, setSelectedTags] = useState<string[]>(resource.tags);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 100);
  const tagSelectorTranslations = useTagSelectorTranslations();
  const [updateMyNdlaResource, { loading }] = useUpdateMyNdlaResourceMutation();
  const toast = useToast();

  const tagsQuery = useQuery<GQLUpdateResourceTagsQuery, GQLUpdateResourceTagsQueryVariables>(queryDef);

  const filteredTags = useMemo(() => {
    if (!debouncedQuery) return tagsQuery.data?.myNdlaResourceTags ?? [];
    return (
      tagsQuery.data?.myNdlaResourceTags.filter((tag) => tag.toLowerCase().includes(debouncedQuery.toLowerCase())) ?? []
    );
  }, [debouncedQuery, tagsQuery.data?.myNdlaResourceTags]);

  const allTagsCollection = useMemo(
    () => createListCollection({ items: tagsQuery.data?.myNdlaResourceTags ?? [] }),
    [tagsQuery.data?.myNdlaResourceTags],
  );

  const onSave = async () => {
    await updateMyNdlaResource({
      variables: { id: resource.id, tags: selectedTags },
      onCompleted: () => {
        onClose();
        toast.create({ title: t("myNdla.resource.tagsUpdated") });
      },
      onError: () => toast.create({ title: t("myNdla.resource.tagsUpdatedFailed") }),
    });
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{t("myNdla.resource.updateTags")}</DialogTitle>
        <DialogCloseButton />
      </DialogHeader>
      <DialogBody>
        <TagSelectorRoot
          value={selectedTags}
          collection={allTagsCollection}
          onInputValueChange={(details) => setQuery(details.inputValue)}
          onValueChange={(details) => setSelectedTags(details.value)}
          translations={tagSelectorTranslations}
        >
          <TagSelectorLabel>{t("myNdla.myTags")}</TagSelectorLabel>
          <HStack gap="4xsmall">
            <TagSelectorControl asChild>
              <InputContainer>
                <TagSelectorInput asChild>
                  <Input placeholder={t("tagSelector.placeholder")} />
                </TagSelectorInput>

                <TagSelectorClearTrigger asChild>
                  <IconButton variant="clear">
                    <CloseLine />
                  </IconButton>
                </TagSelectorClearTrigger>
              </InputContainer>
            </TagSelectorControl>
            <TagSelectorTrigger asChild>
              <IconButton variant="secondary">
                <ArrowDownShortLine />
              </IconButton>
            </TagSelectorTrigger>
          </HStack>
          <StyledComboboxContent>
            {filteredTags.map((item) => (
              <ComboboxItem key={item} item={item}>
                <ComboboxItemText>{item}</ComboboxItemText>
                <ComboboxItemIndicator>
                  <CheckLine />
                </ComboboxItemIndicator>
              </ComboboxItem>
            ))}
          </StyledComboboxContent>
        </TagSelectorRoot>
      </DialogBody>
      <DialogFooter>
        <DialogCloseTrigger asChild>
          <Button variant="secondary">{t("close")}</Button>
        </DialogCloseTrigger>
        <Button onClick={onSave} loading={loading} disabled={!shouldUpdateMyNdlaResource(resource, selectedTags)}>
          {t("save")}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
