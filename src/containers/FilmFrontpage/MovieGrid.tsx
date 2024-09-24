/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { Heading, Skeleton } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import FilmContentCard from "./FilmContentCard";
import { GQLResourceTypeMoviesQuery, GQLResourceTypeMoviesQueryVariables } from "../../graphqlTypes";
import { useGraphQuery } from "../../util/runQueries";

const StyledSection = styled("section", {
  base: {
    display: "flex",
    flexDirection: "column",
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

const StyledHeading = styled(Heading, {
  base: {
    display: "flex",
    gap: "small",
    paddingBlockEnd: "xsmall",
  },
});

const LoadingShimmer = () => {
  return new Array(24).fill(0).map((_, index) => (
    <Skeleton key={index}>
      <StyledFilmContentCard
        movie={{
          id: `dummy-${index}`,
          resourceTypes: [],
          path: "",
          title: "",
        }}
      />
    </Skeleton>
  ));
};

interface Props {
  resourceType: { id: string; name: string };
}

const MovieGrid = ({ resourceType }: Props) => {
  const { t, i18n } = useTranslation();
  const resourceTypeMovies = useGraphQuery<GQLResourceTypeMoviesQuery, GQLResourceTypeMoviesQueryVariables>(
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
      <StyledHeading textStyle="title.large" fontWeight="bold" asChild consumeCss>
        <h3>{t(resourceType.name)}</h3>
      </StyledHeading>
      <MovieListing>
        {resourceTypeMovies.loading ? (
          <LoadingShimmer />
        ) : (
          resourceTypeMovies.data?.searchWithoutPagination?.results?.map((movie, index) => (
            <StyledFilmContentCard
              style={{ "--index": index } as CSSProperties}
              key={`${resourceType.id}-${index}`}
              movie={{
                id: movie.id,
                metaImage: movie.metaImage,
                resourceTypes: [],
                title: movie.title,
                path: movie.contexts.filter((c) => c.contextType === "standard")[0]?.path ?? "",
              }}
            />
          ))
        )}
      </MovieListing>
    </StyledSection>
  );
};

export default MovieGrid;

const resourceTypeMoviesQuery = gql`
  query resourceTypeMovies($resourceType: String!, $language: String!) {
    searchWithoutPagination(
      resourceTypes: $resourceType
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
          contextId
          contextType
          path
        }
      }
    }
  }
`;
