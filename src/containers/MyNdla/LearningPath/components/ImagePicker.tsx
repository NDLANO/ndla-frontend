/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { DeleteBinLine } from "@ndla/icons/action";
import { ImageSearch } from "@ndla/image-search";
import { Button, Image, Spinner, Text } from "@ndla/primitives";
import { HStack, styled, VStack } from "@ndla/styled-system/jsx";
import { IImageMetaInformationV3, ISearchResultV3 } from "@ndla/types-backend/image-api";
import { useImageSearchTranslations } from "@ndla/ui";
import { GQLImageFragmentFragment } from "../../../../graphqlTypes";
import { useFetchImage, useImageSearch } from "../../imageQueries";

interface Props {
  imageId?: string;
  setImageForm: (image: IImageMetaInformationV3 | undefined) => void;
}

export const ImagePicker = ({ imageId, setImageForm }: Props) => {
  const { image, loading, refetch: refetchImage } = useFetchImage({ variables: { id: imageId! }, skip: !imageId });
  const { i18n } = useTranslation();

  const searchImageTranslations = useImageSearchTranslations();

  const { refetch } = useImageSearch({
    variables: { page: 1, pageSize: 16 },
  });

  if (loading) {
    return <Spinner />;
  }

  return imageId && image ? (
    <PickedImage image={image} loading={loading} />
  ) : (
    <ImageSearch
      locale={i18n.language}
      translations={searchImageTranslations}
      searchImages={async (query, page) => (await refetch({ query, page })).data.imageSearch as ISearchResultV3}
      onImageSelect={(image) => setImageForm(image)}
      fetchImage={async (imageId) =>
        (await refetchImage({ id: imageId.toString() })).data.imageV3 as IImageMetaInformationV3
      }
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
interface PickedImageProps {
  loading: boolean;
  image: GQLImageFragmentFragment;
}

const PickedImage = ({ loading, image }: PickedImageProps) => {
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
          <TextVStack gap="4xsmall">
            <Text fontWeight="bold" textStyle="label.medium">
              {t("myNdla.learningpath.form.title.copyright")}
            </Text>
            <Text textStyle="label.small">{image.copyright.license.license}</Text>
          </TextVStack>
        </TextVStack>
      </HStack>
      <VStack justify="flex-end">
        <Button variant="danger" size="small">
          {t("myNdla.learningpath.form.delete")}
          <DeleteBinLine />
        </Button>
      </VStack>
    </Wrapper>
  );
};
