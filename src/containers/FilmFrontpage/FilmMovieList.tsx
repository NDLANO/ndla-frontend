/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";
import styled from "@emotion/styled";
import { IconButtonV2 } from "@ndla/button";
import { Carousel } from "@ndla/carousel";
import { breakpoints, colors, mq, spacing } from "@ndla/core";
import { ChevronLeft, ChevronRight } from "@ndla/icons/common";
import { Heading } from "@ndla/typography";
import FilmContentCard from "./FilmContentCard";
import { GQLFilmMovieList_MovieFragment } from "../../graphqlTypes";

interface Props {
  movies: GQLFilmMovieList_MovieFragment[];
  name?: string;
  slideBackwardsLabel: string;
  slideForwardsLabel: string;
}

const StyledSection = styled.section`
  margin-bottom: ${spacing.normal};
  ${mq.range({ from: breakpoints.tablet })} {
    margin-bottom: ${spacing.large};
  }
`;

const StyledHeading = styled(Heading)`
  color: ${colors.white};
  margin: ${spacing.xsmall} 0;
  margin-left: ${spacing.normal};
  margin-right: ${spacing.normal};
  ${mq.range({ from: breakpoints.desktop })} {
    margin-left: ${spacing.xlarge};
    margin-right: ${spacing.xlarge};
  }
`;

const FilmMovieList = ({ name, movies = [], slideBackwardsLabel, slideForwardsLabel }: Props) => (
  <StyledSection>
    {!!name && (
      <StyledHeading element="h2" headingStyle="list-title">
        {name}
      </StyledHeading>
    )}
    <Carousel
      leftButton={
        <IconButtonV2 aria-label={slideBackwardsLabel}>
          <ChevronLeft />
        </IconButtonV2>
      }
      rightButton={
        <IconButtonV2 aria-label={slideForwardsLabel}>
          <ChevronRight />
        </IconButtonV2>
      }
      items={movies.map((movie) => (
        <FilmContentCard key={movie.id} movie={movie} type="list" lazy />
      ))}
    />
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
