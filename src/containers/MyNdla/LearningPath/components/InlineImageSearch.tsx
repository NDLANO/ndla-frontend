/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useQuery } from "@apollo/client";
import { DeleteBinLine } from "@ndla/icons/action";
import { BaseImageSearch, ImageSearch } from "@ndla/image-search";
import { FieldLabel, FieldRoot, IconButton, Spinner } from "@ndla/primitives";
import { HStack } from "@ndla/styled-system/jsx";
import { IImageMetaInformationV3, ISearchParams } from "@ndla/types-backend/image-api";
import { imageSearchQuery } from "../learningpathqueries";

interface Props {
  imageId?: string;
}

const InlineImageSearch = ({ imageId }: Props) => {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(imageId);
  const { t, i18n } = useTranslation();
  const [queryObject, setQueryObject] = useState<ISearchParams>({});
  const { loading, error, data, refetch } = useQuery(imageSearchQuery, {
    variables: queryObject,
  });

  const images = [];

  const { control } = useForm();

  if (loading) {
    return <Spinner />;
  }

  return (
    <FieldRoot>
      {imageId ? (
        <>
          <HStack justify="space-between">
            <FieldLabel></FieldLabel>
            <IconButton variant="danger" onClick={() => setSelectedImage(undefined)}>
              <DeleteBinLine />
            </IconButton>
          </HStack>
        </>
      ) : (
        <>
          <FieldLabel></FieldLabel>
          <BaseImageSearch
            queryObject={queryObject}
            onImageClick={(imageId) => setSelectedImage(imageId)}
            onSelectImage={}
            handleQueryChange={}
            locale={i18n.language}
            totalCount={}
            translations={}
            searchImages={refetch}
            noResultsFound={}
            images={}
          />
        </>
      )}
    </FieldRoot>
  );
};
