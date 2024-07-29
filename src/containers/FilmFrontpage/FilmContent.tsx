/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import AllMoviesAlphabetically from "./AllMoviesAlphabetically";
import { ALL_MOVIES_ID, findName } from "./filmHelper";
import FilmMovieList from "./FilmMovieList";
import MovieGrid from "./MovieGrid";
import { MovieResourceType } from "./resourceTypes";
import { GQLMovieTheme } from "../../graphqlTypes";

interface Props {
  resourceTypeSelected: MovieResourceType | undefined;
  movieThemes: GQLMovieTheme[] | undefined;
  loadingPlaceholderHeight: string;
}

export const FilmContent = ({ resourceTypeSelected, movieThemes, loadingPlaceholderHeight }: Props) => {
  const { i18n } = useTranslation();

  if (resourceTypeSelected?.id === ALL_MOVIES_ID) {
    return <AllMoviesAlphabetically />;
  }

  if (resourceTypeSelected && resourceTypeSelected?.id !== "fromNdla") {
    return <MovieGrid resourceType={resourceTypeSelected} loadingPlaceholderHeight={loadingPlaceholderHeight} />;
  }

  return movieThemes?.map((theme) => (
    <FilmMovieList key={theme.name[0]?.name} name={findName(theme.name ?? [], i18n.language)} movies={theme.movies} />
  ));
};
