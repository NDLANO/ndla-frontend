/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";
import { Heading } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { Carousel } from "./Carousel";
import FilmContentCard from "./FilmContentCard";
import { GQLFilmMovieList_MovieFragment } from "../../graphqlTypes";

interface Props {
  movies: GQLFilmMovieList_MovieFragment[];
  name?: string;
}

const StyledSection = styled("section", {
  base: {
    paddingBlockEnd: "medium",
  },
});

const StyledHeading = styled(Heading, {
  base: {
    paddingBlock: "xsmall",
    paddingInline: "3xlarge",
    desktopDown: {
      paddingInline: "medium",
    },
  },
});

const FilmMovieList = ({ name, movies = [] }: Props) => (
  <StyledSection>
    {!!name && (
      <StyledHeading textStyle="title.large" fontWeight="bold" asChild consumeCss>
        <h3>{name}</h3>
      </StyledHeading>
    )}
    <Carousel>
      {movies.map((movie) => (
        <FilmContentCard key={movie.id} movie={movie} />
      ))}
    </Carousel>
  </StyledSection>
);

FilmMovieList.fragments = {
  movie: gql`
    fragment FilmMovieList_Movie on Movie {
      ...FilmContentCard_Movie
    }
    ${FilmContentCard.fragments.movie}
  `,
};

export default FilmMovieList;
