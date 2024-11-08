/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { ImageSearch } from "@ndla/image-search";
import { IImageMetaInformationV3, ISearchParams, ISearchResultV3 } from "@ndla/types-backend/image-api";
import { useImageSearchTranslations } from "@ndla/ui";
import { LocaleType } from "../../../../interfaces";
import { apiResourceUrl, fetchAuthorized, resolveJsonOrRejectWithError } from "../../../../util/apiHelpers";

interface Props {
  onChange: (...event: any[]) => void;
}

type NdlaErrorFields = {
  status: number;
  messages: string;
  json: any;
};

//Most functions are copies from ED, move to utils later?

export type NdlaErrorPayload = NdlaErrorFields & Error;
const baseUrl = apiResourceUrl("/image-api/v3/images");

const fetchImage = (id: number | string, language?: string): Promise<IImageMetaInformationV3> =>
  fetchAuthorized(`${baseUrl}/${id}?language=${language}`).then((r) =>
    resolveJsonOrRejectWithError<IImageMetaInformationV3>(r),
  );

const onError = (err: Response & Error) => {
  throwErrorPayload(err.status, err.message ?? err.statusText, err);
};

function buildErrorPayload(status: number, messages: string, json: any): NdlaErrorPayload {
  return Object.assign({}, { status, json, messages }, new Error(""));
}

function throwErrorPayload(status: number, messages: string, json: any) {
  throw buildErrorPayload(status, messages, json);
}

const postSearchImages = async (body: StringSort<ISearchParams>): Promise<ISearchResultV3> => {
  const response = await fetchAuthorized(`${baseUrl}/search/`, { method: "POST", body: JSON.stringify(body) });
  return resolveJsonOrRejectWithError(response);
};

type StringSort<T> = Omit<T, "sort"> & { sort?: string };

const SearchMetaImage = ({ onChange }: Props) => {
  const { t, i18n } = useTranslation();
  const imageSearchTranslations = useImageSearchTranslations();
  const locale: LocaleType = i18n.language;
  const fetchImageWithLocale = (id: number) => fetchImage(id, locale);
  const searchImagesWithParameters = (query?: string, page?: number) => {
    return postSearchImages({ query, page, pageSize: 16 });
  };

  return (
    <ImageSearch
      fetchImage={fetchImageWithLocale}
      searchImages={searchImagesWithParameters}
      locale={locale}
      translations={imageSearchTranslations}
      onImageSelect={(image: IImageMetaInformationV3) => onChange(image)}
      noResults={<div>{t("imageSearch.noResultsText")}</div>}
      onError={onError}
    />
  );
};

export default SearchMetaImage;
