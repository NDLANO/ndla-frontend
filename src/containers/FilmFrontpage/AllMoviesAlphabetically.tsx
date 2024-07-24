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
import { Heading, Text, Image } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { HStack, styled } from "@ndla/styled-system/jsx";
import { OneColumn } from "@ndla/ui";
import { movieResourceTypes } from "./resourceTypes";
import { GQLAllMoviesQuery, GQLAllMoviesQueryVariables } from "../../graphqlTypes";
import { useGraphQuery } from "../../util/runQueries";

const LetterHeading = styled(Heading, {
  base: {
    borderBottom: "1px solid",
    borderColor: "stroke.subtle",
  },
});

const MovieTextWrapper = styled("div", {
  base: { flex: 1 },
});

const MovieImage = styled(Image, {
  base: {
    width: "surface.3xsmall",
    tablet: {
      width: "surface.3xsmall",
    },
  },
});

const StyledSafeLink = styled(SafeLink, {
  base: {
    display: "flex",
    gap: "small",
    height: "surface.4xsmall",
    overflow: "hidden",
  },
});

const MovieGroup = styled("section", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "medium",
  },
});

const LETTER_REGEXP = /[A-Z\WÆØÅ]+/;

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
    <HStack justify="center">
      <OneColumn wide>
        {groupedMovies.map(({ letter, movies }) => (
          <MovieGroup key={letter}>
            <LetterHeading
              textStyle="title.medium"
              fontWeight="bold"
              aria-label={t("filmfrontpage.allMovieGroupTitleLabel", { letter })}
              asChild
              consumeCss
            >
              <h2>{letter}</h2>
            </LetterHeading>
            {movies.map((movie) => (
              <StyledSafeLink
                to={movie.contexts.filter((c) => c.contextType === "standard")[0]?.path ?? ""}
                key={movie.id}
              >
                {movie.metaImage?.url && (
                  <MovieImage alt="" loading="lazy" fallbackWidth={150} src={movie.metaImage.url} />
                )}
                <MovieTextWrapper>
                  <Heading textStyle="title.small" asChild consumeCss>
                    <h4>{movie.title}</h4>
                  </Heading>
                  <Text textStyle="body.small">{movie.metaDescription}</Text>
                </MovieTextWrapper>
              </StyledSafeLink>
            ))}
          </MovieGroup>
        ))}
      </OneColumn>
    </HStack>
  );
};

export default AllMoviesAlphabetically;

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
