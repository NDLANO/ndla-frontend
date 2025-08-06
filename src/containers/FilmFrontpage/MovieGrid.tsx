/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import { gql, useQuery } from "@apollo/client";
import { Heading, Skeleton } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import FilmContentCard from "./FilmContentCard";
import { FILM_ID } from "../../constants";
import {
  GQLResourceTypeMoviesQuery,
  GQLResourceTypeMoviesQueryVariables,
  GQLSelectionMovieGrid_MovieFragment,
} from "../../graphqlTypes";

const StyledSection = styled("section", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
  },
});

const MovieListing = styled("div", {
  base: {
    display: "grid",
    gap: "medium",
    gridTemplateColumns: "repeat(2, 1fr)",
    tablet: {
      gridTemplateColumns: "repeat(3, 1fr)",
    },
    desktop: {
      gridTemplateColumns: "repeat(4, 1fr)",
    },
  },
});

const StyledFilmContentCard = styled(FilmContentCard, {
  base: {
    animationFillMode: "backwards",
    animationName: "fade-in",
    animationDuration: "300ms",
    animationDelay: "calc(var(--index) * 50ms)",
  },
});

interface MovieGridLoadingShimmerProps {
  showHeading?: boolean;
}

export const MovieGridLoadingShimmer = ({ showHeading }: MovieGridLoadingShimmerProps) => {
  return (
    <StyledSection>
      {!!showHeading && (
        <Skeleton>
          <Heading textStyle="title.large" fontWeight="bold" asChild consumeCss>
            <h3>&nbsp;</h3>
          </Heading>
        </Skeleton>
      )}
      <MovieListing>
        {new Array(24).fill(0).map((_, index) => (
          <Skeleton key={index}>
            <StyledFilmContentCard
              movie={{
                id: `dummy-${index}`,
                resourceTypes: [],
                url: "",
                title: "",
              }}
            />
          </Skeleton>
        ))}
      </MovieListing>
    </StyledSection>
  );
};

interface Props {
  resourceType: { id: string; name: string };
}

export const MovieGrid = ({ resourceType }: Props) => {
  const { t, i18n } = useTranslation();
  const resourceTypeMovies = useQuery<GQLResourceTypeMoviesQuery, GQLResourceTypeMoviesQueryVariables>(
    resourceTypeMoviesQuery,
    {
      variables: {
        resourceType: resourceType.id,
        language: i18n.language,
      },
    },
  );

  return (
    <StyledSection>
      <Heading textStyle="title.large" fontWeight="bold" asChild consumeCss>
        <h3>{t(resourceType.name)}</h3>
      </Heading>
      {resourceTypeMovies.loading ? (
        <MovieGridLoadingShimmer />
      ) : (
        <MovieListing>
          {resourceTypeMovies.data?.searchWithoutPagination?.results?.map((movie, index) => {
            if (movie.__typename === "ArticleSearchResult" || movie.__typename === "LearningpathSearchResult") {
              const context = movie.contexts.find((c) => c.rootId === FILM_ID);
              return (
                <StyledFilmContentCard
                  style={{ "--index": index } as CSSProperties}
                  key={`${resourceType.id}-${index}`}
                  movie={{
                    id: movie.id,
                    metaImage: movie.metaImage,
                    resourceTypes: [],
                    title: movie.title,
                    url: context?.url ?? "",
                  }}
                />
              );
            }
            return null;
          })}
        </MovieListing>
      )}
    </StyledSection>
  );
};

interface SelectionMovieGridProps {
  name: string;
  movies: GQLSelectionMovieGrid_MovieFragment[];
}

export const SelectionMovieGrid = ({ name, movies }: SelectionMovieGridProps) => {
  return (
    <StyledSection>
      <Heading textStyle="title.large" fontWeight="bold" asChild consumeCss>
        <h3>{name}</h3>
      </Heading>
      <MovieListing>
        {movies.map((movie, index) => (
          <StyledFilmContentCard style={{ "--index": index } as CSSProperties} key={`${name}-${index}`} movie={movie} />
        ))}
      </MovieListing>
    </StyledSection>
  );
};

SelectionMovieGrid.fragments = {
  movie: gql`
    fragment SelectionMovieGrid_Movie on Movie {
      ...FilmContentCard_Movie
    }
    ${FilmContentCard.fragments.movie}
  `,
};

const resourceTypeMoviesQuery = gql`
  query resourceTypeMovies($resourceType: String!, $language: String!) {
    searchWithoutPagination(
      resourceTypes: $resourceType
      language: $language
      fallback: "true"
      subjects: "urn:subject:20"
      contextTypes: "standard"
      sort: "title"
    ) {
      results {
        id
        metaDescription
        ... on ArticleSearchResult {
          metaImage {
            url
          }
        }
        ... on LearningpathSearchResult {
          metaImage {
            url
          }
        }
        title
        contexts {
          contextId
          url
          rootId
        }
      }
    }
  }
`;
