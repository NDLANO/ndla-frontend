/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import styled from "@emotion/styled";
import { breakpoints, mq, spacing, colors } from "@ndla/core";
import { SafeLink } from "@ndla/safelink";
import { Heading, Text } from "@ndla/typography";
import { Image } from "@ndla/ui";
import { movieResourceTypes } from "./resourceTypes";
import { GQLAllMoviesQuery, GQLAllMoviesQueryVariables } from "../../graphqlTypes";
import { useGraphQuery } from "../../util/runQueries";

const IMAGE_WIDTH = 143;

const LetterHeading = styled(Heading)`
  color: ${colors.white};
  padding-left: ${spacing.nsmall};
  padding-bottom: ${spacing.small};
  border-bottom: 1px solid ${colors.brand.greyDark};
`;

const StyledWrapper = styled.section`
  width: 652px;
  max-width: 100%;
  margin: ${spacing.large} auto;
  padding: 0 ${spacing.normal};
  display: flex;
  flex-direction: column;
  gap: ${spacing.normal};
`;

const MovieTextWrapper = styled.div`
  ${mq.range({ from: breakpoints.tablet })} {
    padding: ${spacing.xsmall} ${spacing.xsmall} 0 0;
  }
  flex: 1;
`;

const MovieImage = styled(Image)`
  width: 104px;
  height: 80px;
  ${mq.range({ from: breakpoints.tablet })} {
    width: ${IMAGE_WIDTH}px;
    height: 90px;
  }
`;

const MovieTitle = styled(Heading)`
  color: ${colors.white};
`;

const MovieDescription = styled(Text)`
  color: ${colors.brand.greyLighter};
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
`;

const StyledSafeLink = styled(SafeLink)`
  color: ${colors.white};
  box-shadow: none;
  display: flex;
  gap: ${spacing.small};
  &:hover,
  &:focus {
    [data-title] {
      text-decoration: underline;
    }
  }
`;

const MovieGroup = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${spacing.normal};
`;

const LETTER_REGEXP = /[A-Z\WÆØÅ]+/;

const allMoviesQuery = gql`
  query allMovies($resourceTypes: String!, $language: String!) {
    searchWithoutPagination(
      resourceTypes: $resourceTypes
      language: $language
      fallback: "true"
      subjects: "urn:subject:20"
      contextTypes: "standard"
    ) {
      results {
        id
        metaDescription
        metaImage {
          url
        }
        title
        contexts {
          contextType
          path
        }
      }
    }
  }
`;

type MovieType = NonNullable<GQLAllMoviesQuery["searchWithoutPagination"]>["results"][0];

const groupMovies = (movies: MovieType[]) => {
  const sortedMovies = movies.toSorted((a, b) => a.title.localeCompare(b.title));

  const grouped = sortedMovies.reduce<Record<string, MovieType[]>>((acc, movie) => {
    const firstChar = movie.title[0]?.toUpperCase() ?? "";
    const isLetter = firstChar?.match(LETTER_REGEXP);
    const char = isLetter ? firstChar : "#";
    if (acc[char]) {
      acc[char]!.push(movie);
    } else {
      acc[char] = [movie];
    }
    return acc;
  }, {});
  return Object.entries(grouped).map(([letter, movies]) => ({
    letter,
    movies,
  }));
};

const AllMoviesAlphabetically = () => {
  const { t, i18n } = useTranslation();
  const allMovies = useGraphQuery<GQLAllMoviesQuery, GQLAllMoviesQueryVariables>(allMoviesQuery, {
    variables: {
      resourceTypes: movieResourceTypes.map((resourceType) => resourceType.id).join(","),
      language: i18n.language,
    },
  });

  const groupedMovies = useMemo(() => {
    if (!allMovies.data?.searchWithoutPagination?.results) return [];
    return groupMovies(allMovies.data.searchWithoutPagination.results);
  }, [allMovies.data?.searchWithoutPagination?.results]);

  return (
    <StyledWrapper>
      {groupedMovies.map(({ letter, movies }) => (
        <MovieGroup key={letter}>
          <LetterHeading
            element="h2"
            headingStyle="h2"
            margin="none"
            aria-label={t("filmfrontpage.allMovieGroupTitleLabel", { letter })}
          >
            {letter}
          </LetterHeading>
          {movies.map((movie) => (
            <StyledSafeLink
              to={movie.contexts.filter((c) => c.contextType === "standard")[0]?.path ?? ""}
              key={movie.id}
            >
              {!!movie.metaImage?.url && (
                <MovieImage alt="" lazyLoad fallbackWidth={IMAGE_WIDTH * 2} src={movie.metaImage.url} />
              )}
              <MovieTextWrapper>
                <MovieTitle element="h3" headingStyle="h3" margin="none" data-title>
                  {movie.title}
                </MovieTitle>
                <MovieDescription margin="none" textStyle="content-alt">
                  {movie.metaDescription}
                </MovieDescription>
              </MovieTextWrapper>
            </StyledSafeLink>
          ))}
        </MovieGroup>
      ))}
    </StyledWrapper>
  );
};

export default AllMoviesAlphabetically;
