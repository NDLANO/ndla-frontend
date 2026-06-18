/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";
import { keyBy } from "@ndla/util";
import { useTranslation } from "react-i18next";
import config from "../../config";
import { GQLFilmContent_MovieThemeFragment } from "../../graphqlTypes";
import { AllMoviesAlphabetically } from "./AllMoviesAlphabetically";
import { ALL_MOVIES_ID } from "./filmHelper";
import { MovieGrid, MovieGridLoadingShimmer, SelectionMovieGrid } from "./MovieGrid";
import { MovieResourceType } from "./resourceTypes";

interface Props {
  resourceTypeSelected: MovieResourceType | undefined;
  movieThemes: GQLFilmContent_MovieThemeFragment[] | undefined;
  loadingPlaceholderHeight: string;
  loading: boolean;
}

export const FilmContent = ({ resourceTypeSelected, movieThemes, loading }: Props) => {
  const { i18n } = useTranslation();

  if (resourceTypeSelected?.id === ALL_MOVIES_ID) {
    return <AllMoviesAlphabetically />;
  }

  if (resourceTypeSelected && resourceTypeSelected?.id !== "fromNdla") {
    return <MovieGrid resourceType={resourceTypeSelected} />;
  }

  if (loading) {
    return <MovieGridLoadingShimmer showHeading />;
  }

  return movieThemes?.map((theme) => {
    const keyed = keyBy(theme.name, (name) => name.language);
    return (
      <SelectionMovieGrid
        key={theme.name[0]?.name}
        name={keyed[i18n.language]?.name ?? keyed[config.defaultLocale]?.name ?? ""}
        movies={theme.movies}
      />
    );
  });
};

FilmContent.fragments = {
  movieTheme: gql`
    fragment FilmContent_MovieTheme on MovieTheme {
      name {
        name
        language
      }
      movies {
        ...SelectionMovieGrid_Movie
      }
    }
    ${SelectionMovieGrid.fragments.movie}
  `,
};
