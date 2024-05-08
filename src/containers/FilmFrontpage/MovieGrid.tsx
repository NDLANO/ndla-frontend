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
import styled from "@emotion/styled";
import { breakpoints, colors, mq, spacing } from "@ndla/core";
import { Heading } from "@ndla/typography";
import FilmContentCard from "./FilmContentCard";
import { GQLResourceTypeMoviesQuery, GQLResourceTypeMoviesQueryVariables } from "../../graphqlTypes";
import { useGraphQuery } from "../../util/runQueries";

const StyledSection = styled.section`
  margin-left: ${spacing.normal};
  margin-right: ${spacing.normal};
  ${mq.range({ from: breakpoints.desktop })} {
    margin-left: ${spacing.xlarge};
    margin-right: ${spacing.xlarge};
  }
`;

const MovieListing = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${spacing.normal};
  margin: ${spacing.small} 0;
`;

const StyledFilmContentCard = styled(FilmContentCard)`
  opacity: 0;
  animation-fill-mode: forwards;
  animation-name: fadeIn;
  animation-duration: 300ms;
  animation-delay: calc(var(--index) * 50ms);
`;

const StyledHeading = styled(Heading)`
  color: ${colors.white};
  display: flex;
  gap: ${spacing.small};
  margin: ${spacing.xsmall} 0;
`;

interface Props {
  resourceType: { id: string; name: string };
  loadingPlaceholderHeight?: string;
}

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
      <StyledHeading element="h2" headingStyle="list-title">
        {resourceType.name}
        <small>
          {resourceTypeMovies.loading
            ? t("ndlaFilm.loadingMovies")
            : `${resourceTypeMovies.data?.searchWithoutPagination?.results.length} ${t(
                "ndlaFilm.movieMatchInCategory",
              )}`}
        </small>
      </StyledHeading>
      <MovieListing>
        {resourceTypeMovies.loading ? (
          <div style={{ height: loadingPlaceholderHeight }} />
        ) : (
          resourceTypeMovies.data?.searchWithoutPagination?.results?.map((movie, index) => (
            <StyledFilmContentCard
              key={index}
              style={{ "--index": index } as CSSProperties}
              hideTags
              movie={{
                id: movie.id,
                metaImage: movie.metaImage,
                resourceTypes: [],
                title: movie.title,
                path: movie.contexts.filter((c) => c.contextType === "standard")[0]?.path ?? "",
              }}
              lazy
              type="list"
            />
          ))
        )}
      </MovieListing>
    </StyledSection>
  );
};

export default MovieGrid;
