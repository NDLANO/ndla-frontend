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
import { licenses } from "@ndla/licenses";
import { Button, Image, Spinner, Text } from "@ndla/primitives";
import { HStack, Stack, styled, VStack } from "@ndla/styled-system/jsx";
import { ImageMetaInformationV3DTO, SearchResultV3DTO } from "@ndla/types-backend/image-api";
import { useImageSearchTranslations } from "@ndla/ui";
import { GQLImageFragment } from "../../../../graphqlTypes";
import { useFetchImage, useImageSearch } from "../../imageQueries";

interface Props {
  imageUrl: string;
  onSelectImage: (image?: ImageMetaInformationV3DTO) => void;
}

export const ImagePicker = ({ imageUrl, onSelectImage }: Props) => {
  const searchImageTranslations = useImageSearchTranslations();
  const { i18n, t } = useTranslation();

  const imageId = imageUrl?.split("/").pop();

  const [fetchImage, { loading, data: image }] = useFetchImage();

  useEffect(() => {
    if (imageId) {
      fetchImage({ variables: { id: imageId } });
    }
  }, [fetchImage, imageId]);

  const [fetchImages] = useImageSearch();

  const onSearchImage = async (query?: string, page?: number) =>
    (await fetchImages({ variables: { query, page: page ?? 1, pageSize: 16, license: licenses.CC_BY_SA_4 } }))?.data
      ?.imageSearch as SearchResultV3DTO;

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
      noResults={<Text>{t("myNdla.learningpath.form.title.noResult")}</Text>}
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
    flexWrap: "wrap",
    justifyContent: "space-between",
    border: "1px solid",
    borderRadius: "xsmall",
    borderColor: "stroke.disabled",
  },
});

const StyledStack = styled(Stack, {
  base: {
    height: "100%",
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
        <StyledStack align="start" justify="start" gap="xsmall">
          <Stack align="start" justify="start" gap="4xsmall">
            <Text fontWeight="bold" textStyle="label.medium">
              {t("myNdla.learningpath.form.title.imageTitle")}
            </Text>
            <Text textStyle="label.small">{image.title.title}</Text>
          </Stack>
          {image.copyright.rightsholders.length ? (
            <Stack align="start" justify="start" gap="4xsmall">
              <Text fontWeight="bold" textStyle="label.medium">
                {t("myNdla.learningpath.form.title.copyright")}
              </Text>
              <Text textStyle="label.small">{image.copyright.rightsholders.map((r) => r.name).join(", ")}</Text>
            </Stack>
          ) : null}
        </StyledStack>
      </HStack>
      <VStack justify="flex-end">
        <Button onClick={onRemove} variant="danger">
          {t("myNdla.learningpath.form.delete")}
          <DeleteBinLine />
        </Button>
      </VStack>
    </Wrapper>
  );
};
