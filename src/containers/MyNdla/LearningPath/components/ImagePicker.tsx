/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { DeleteBinLine } from "@ndla/icons/action";
import { FieldHelper, FieldLabel, FieldRoot, Button, Image, Spinner } from "@ndla/primitives";
import { HStack, Stack, styled } from "@ndla/styled-system/jsx";
import { IImageMetaInformationV3 } from "@ndla/types-backend/image-api";
import { InlineImageSearch } from "./InlineImageSearch";
import { useFetchImage } from "../../learningpathQueries";

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
  const { image, loading } = useFetchImage({ variables: { id: imageId! }, skip: !imageId });

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
        <>
          <StyledImage alt={image.alttext.alttext} src={image.image.imageUrl} />
        </>
      ) : (
        <InlineImageSearch setImageForm={setImageForm} />
      )}
    </FieldRoot>
  );
};
