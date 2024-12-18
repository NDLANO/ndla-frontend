/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { DeleteBinLine } from "@ndla/icons";
import { ImageSearch } from "@ndla/image-search";
import { Button, Image, Spinner, Text } from "@ndla/primitives";
import { HStack, styled, VStack } from "@ndla/styled-system/jsx";
import { IImageMetaInformationV3DTO, ISearchResultV3DTO } from "@ndla/types-backend/image-api";
import { useImageSearchTranslations } from "@ndla/ui";
import { GQLImageFragment } from "../../../../graphqlTypes";
import { useFetchImage, useImageSearch } from "../../imageQueries";

interface Props {
  imageUrl?: string;
  onSelectImage: (image?: IImageMetaInformationV3DTO) => void;
}

export const ImagePicker = ({ imageUrl, onSelectImage }: Props) => {
  const searchImageTranslations = useImageSearchTranslations();
  const { i18n, t } = useTranslation();

  const imageId = imageUrl?.split("/").pop();

  const [fetchImage, { loading, data: image }] = useFetchImage({
    variables: { id: imageId! },
    skip: !imageId,
  });

  useEffect(() => {
    if (imageId) {
      fetchImage();
    }
  }, [fetchImage, imageId]);

  const [refetch] = useImageSearch({
    variables: { page: 1, pageSize: 16 },
  });

  const onFetchImage = async (imageId: number) =>
    (await fetchImage({ variables: { id: imageId.toString() } })).data?.imageV3 as IImageMetaInformationV3DTO;

  const onSearchImage = async (query?: string, page?: number) =>
    (await refetch({ variables: { query, page } }))?.data?.imageSearch as ISearchResultV3DTO;

  const onRemove = () => {
    onSelectImage(undefined);
  };

  return imageId && image?.imageV3 ? (
    <SelectedImage image={image.imageV3} loading={loading} onRemove={onRemove} />
  ) : (
    <ImageSearch
      locale={i18n.language}
      translations={searchImageTranslations}
      searchImages={onSearchImage}
      onImageSelect={onSelectImage}
      fetchImage={onFetchImage}
      noResults={
        <Text>
          <em>{t("myNdla.learningpath.form.title.noResult")}</em>
        </Text>
      }
      //TODO: Handle error?
      onError={() => {}}
    />
  );
};

const StyledImage = styled(Image, {
  base: {
    maxWidth: "surface.3xsmall",
    maxHeight: "surface.4xsmall",
  },
});

const Wrapper = styled("div", {
  base: {
    padding: "xsmall",
    display: "flex",
    justifyContent: "space-between",
    border: "1px solid",
    borderRadius: "xsmall",
    borderColor: "stroke.disabled",
  },
});

const TextVStack = styled(VStack, {
  base: {
    textAlign: "start",
    alignItems: "start",
    justifyContent: "flex-start",
  },
});
interface SelectedImageProps {
  loading: boolean;
  image: GQLImageFragment;
  onRemove: () => void;
}

const SelectedImage = ({ loading, image, onRemove }: SelectedImageProps) => {
  const { t } = useTranslation();

  if (loading) {
    return <Spinner />;
  }

  return (
    <Wrapper>
      <HStack gap="small">
        <StyledImage alt={image.alttext.alttext} src={image.image.imageUrl} />
        <TextVStack gap="xsmall">
          <TextVStack gap="4xsmall">
            <Text fontWeight="bold" textStyle="label.medium">
              {t("myNdla.learningpath.form.title.imageTitle")}
            </Text>
            <Text textStyle="label.small">{image.title.title}</Text>
          </TextVStack>
          {image.copyright.rightsholders.length ? (
            <TextVStack gap="4xsmall">
              <Text fontWeight="bold" textStyle="label.medium">
                {t("myNdla.learningpath.form.title.copyright")}
              </Text>
              <Text textStyle="label.small">{image.copyright.rightsholders.map((r) => r.name).join(", ")}</Text>
            </TextVStack>
          ) : null}
        </TextVStack>
      </HStack>
      <VStack justify="flex-end">
        <Button onClick={onRemove} variant="danger" size="small">
          {t("myNdla.learningpath.form.delete")}
          <DeleteBinLine />
        </Button>
      </VStack>
    </Wrapper>
  );
};
