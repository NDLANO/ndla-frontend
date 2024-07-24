/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { Heading } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import FilmContentCard from "./FilmContentCard";
import { GQLResourceTypeMoviesQuery, GQLResourceTypeMoviesQueryVariables } from "../../graphqlTypes";
import { useGraphQuery } from "../../util/runQueries";

const StyledSection = styled("section", {
  base: {
    paddingInline: "medium",
    desktop: {
      paddingInline: "3xlarge",
    },
  },
});

const MovieListing = styled("div", {
  base: {
    display: "flex",
    flexWrap: "wrap",
    gap: "medium",
    paddingBlock: "small",
  },
});

const StyledFilmContentCard = styled(FilmContentCard, {
  base: {
    animationFillMode: "forwards",
    animationName: "fadeIn",
    animationDuration: "300ms",
    animationDelay: "calc(var(--key) * 50ms)",
  },
});

const StyledHeading = styled(Heading, {
  base: {
    display: "flex",
    gap: "small",
    paddingBlock: "small",
  },
});

interface Props {
  resourceType: { id: string; name: string };
  loadingPlaceholderHeight?: string;
}

const MovieGrid = ({ resourceType, loadingPlaceholderHeight }: Props) => {
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
          <div style={{ height: loadingPlaceholderHeight }} />
        ) : (
          resourceTypeMovies.data?.searchWithoutPagination?.results?.map((movie, index) => (
            <StyledFilmContentCard
              key={index}
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
          contextType
          path
        }
      }
    }
  }
`;
