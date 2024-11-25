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
import { FieldHelper, FieldLabel, FieldRoot, Button, Image, Spinner } from "@ndla/primitives";
import { HStack, Stack, styled } from "@ndla/styled-system/jsx";
import { IImageMetaInformationV3, ISearchResultV3 } from "@ndla/types-backend/image-api";
import { useImageSearchTranslations } from "@ndla/ui";
import { useFetchImage, useImageSearch } from "../../imageQueries";

const StyledImage = styled(Image, {
  base: {
    width: "surface.small",
    justifySelf: "center",
  },
});

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

  return (
    <FieldRoot>
      <HStack justify="space-between">
        <Stack direction="column" align="flex-start">
          <FieldLabel>Metabilde</FieldLabel>
          <FieldHelper>Legg til et bilde som representerer læringsstien din</FieldHelper>
        </Stack>
        {image && (
          <Button size="small" variant="danger" onClick={() => setImageForm(undefined)}>
            <DeleteBinLine />
            Fjern bilde
          </Button>
        )}
      </HStack>
      {imageId && image ? (
        <>{loading ? <Spinner /> : <StyledImage alt={image.alttext.alttext} src={image.image.imageUrl} />}</>
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
      )}
    </FieldRoot>
  );
};
