/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import AllMoviesAlphabetically from "./AllMoviesAlphabetically";
import { ALL_MOVIES_ID, findName } from "./filmHelper";
import { MovieGrid, MovieGridLoadingShimmer, SelectionMovieGrid } from "./MovieGrid";
import { MovieResourceType } from "./resourceTypes";
import { GQLMovieTheme } from "../../graphqlTypes";

interface Props {
  resourceTypeSelected: MovieResourceType | undefined;
  movieThemes: GQLMovieTheme[] | undefined;
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

  return (
    <>
      {movieThemes?.map((theme) => (
        <SelectionMovieGrid
          key={theme.name[0]?.name}
          name={findName(theme.name ?? [], i18n.language)}
          movies={theme.movies}
        />
      ))}
    </>
  );
};

FilmContent.fragments = {
  movie: gql`
    fragment FilmContent_Movie on Movie {
      ...SelectionMovieGrid_Movie
    }
    ${SelectionMovieGrid.fragments.movie}
  `,
};
