/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";
import { Heading, Skeleton } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { Carousel } from "./Carousel";
import FilmContentCard from "./FilmContentCard";
import { GQLFilmMovieList_MovieFragment } from "../../graphqlTypes";

interface Props {
  movies: GQLFilmMovieList_MovieFragment[];
  name?: string;
  loading: boolean;
}

const StyledSection = styled("section", {
  base: {
    paddingBlockEnd: "medium",
    paddingInline: "medium",
  },
});

const FilmMovieList = ({ name, movies = [], loading }: Props) => {
  if (loading) {
    return (
      <StyledSection>
        <Skeleton css={{ width: "surface.small" }}>
          <Heading textStyle="title.large" fontWeight="bold" asChild consumeCss>
            <h3>{name}</h3>
          </Heading>
        </Skeleton>
        <Carousel>
          {new Array(5).fill(0).map((_, idx) => (
            <Skeleton key={idx}>
              <FilmContentCard key={idx} movie={{ id: "", title: "", resourceTypes: [], path: "" }} />
            </Skeleton>
          ))}
        </Carousel>
      </StyledSection>
    );
  }

  return (
    <StyledSection>
      {!!name && (
        <Heading textStyle="title.large" fontWeight="bold" asChild consumeCss>
          <h3>{name}</h3>
        </Heading>
      )}
      <Carousel>
        {movies.map((movie) => (
          <FilmContentCard key={movie.id} movie={movie} />
        ))}
      </Carousel>
    </StyledSection>
  );
};

FilmMovieList.fragments = {
  movie: gql`
    fragment FilmMovieList_Movie on Movie {
      ...FilmContentCard_Movie
    }
    ${FilmContentCard.fragments.movie}
  `,
};

export default FilmMovieList;
