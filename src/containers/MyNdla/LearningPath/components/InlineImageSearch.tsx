/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ChangeEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { BaseImageSearch } from "@ndla/image-search";
import { IImageMetaInformationV3, ISearchParams } from "@ndla/types-backend/image-api";
import { useImageSearchTranslations } from "@ndla/ui";
import { useImageSearch } from "../../learningpathQueries";

interface Props {
  imageId?: string;
  setImageForm: (image: IImageMetaInformationV3 | undefined) => void;
}

export const InlineImageSearch = ({ setImageForm }: Props) => {
  const [focusedImage, setFocusedImage] = useState<IImageMetaInformationV3 | undefined>(undefined);
  const { i18n } = useTranslation();
  const [queryObject, setQueryObject] = useState<ISearchParams>({
    query: undefined,
    page: 1,
    pageSize: 16,
  });
  const searchImageTranslations = useImageSearchTranslations();
  const { searchResult, refetch, loading } = useImageSearch({
    variables: { page: 1, pageSize: 16 },
  });

  const handleQueryChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    setQueryObject((prevState) => ({
      ...prevState,
      query: value,
    }));
  };

  return (
    <>
      <BaseImageSearch
        queryObject={queryObject}
        onSelectImage={setImageForm}
        handleQueryChange={handleQueryChange}
        locale={i18n.language}
        totalCount={searchResult?.totalCount ?? 0}
        setFocusedImage={setFocusedImage}
        focusedImage={focusedImage}
        translations={searchImageTranslations}
        searchImages={async (searchParams) => {
          await refetch(searchParams);
          setQueryObject((prevState) => ({
            ...prevState,
            ...searchParams,
          }));
        }}
        noResultsFound={!loading && searchResult?.results?.length === 0}
        images={(searchResult?.results as IImageMetaInformationV3[]) ?? []}
      />
    </>
  );
};
