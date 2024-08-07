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

const StyledHeading = styled(Heading, {
  base: {
    marginInline: "medium",
  },
});

const FilmMovieList = ({ name, movies = [], loading }: Props) => {
  if (loading) {
    return (
      <section>
        <Skeleton css={{ width: "surface.small" }}>
          <StyledHeading textStyle="title.large" fontWeight="bold" asChild consumeCss>
            <h3>{name}</h3>
          </StyledHeading>
        </Skeleton>
        <Carousel withInnerMargin={true}>
          {new Array(5).fill(0).map((_, idx) => (
            <Skeleton key={idx}>
              <FilmContentCard key={idx} movie={{ id: "", title: "", resourceTypes: [], path: "" }} />
            </Skeleton>
          ))}
        </Carousel>
      </section>
    );
  }

  return (
    <section>
      {!!name && (
        <StyledHeading textStyle="title.large" fontWeight="bold" asChild consumeCss>
          <h3>{name}</h3>
        </StyledHeading>
      )}
      <Carousel withInnerMargin={true}>
        {movies.map((movie) => (
          <FilmContentCard key={movie.id} movie={movie} />
        ))}
      </Carousel>
    </section>
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
