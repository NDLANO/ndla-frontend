/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TFunction } from "i18next";
import { useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import styled from "@emotion/styled";
import { spacing, utils } from "@ndla/core";
import { Spinner } from "@ndla/icons";

import AboutNdlaFilm from "./AboutNdlaFilm";
import AllMoviesAlphabetically from "./AllMoviesAlphabetically";
import { ALL_MOVIES_ID, findName } from "./filmHelper";
import FilmMovieList from "./FilmMovieList";
import FilmMovieSearch from "./FilmMovieSearch";
import FilmSlideshow from "./FilmSlideshow";
import MovieGrid from "./MovieGrid";
import { MovieResourceType, movieResourceTypes } from "./resourceTypes";
import Article from "../../components/Article";
import SocialMediaMetadata from "../../components/SocialMediaMetadata";
import { SKIP_TO_CONTENT_ID } from "../../constants";
import { GQLFilmFrontPageQuery } from "../../graphqlTypes";
import { useGraphQuery } from "../../util/runQueries";
import { htmlTitle } from "../../util/titleHelper";

const StyledH1 = styled.h1`
  ${utils.visuallyHidden}
`;

const StyledMovieList = styled.div`
  margin: ${spacing.xlarge} 0 ${spacing.xxlarge};
`;

const filmFrontPageQuery = gql`
  query filmFrontPage($subjectId: String!, $transformArgs: TransformedArticleContentInput) {
    filmfrontpage {
      slideShow {
        ...FilmSlideshow_Movie
      }
      movieThemes {
        name {
          name
          language
        }
        movies {
          ...FilmMovieList_Movie
        }
      }
      about {
        title
        description
        visualElement {
          alt
          url
          type
        }
        language
      }
      article {
        ...Article_Article
      }
    }
    subject(id: $subjectId) {
      id
      name
      topics {
        id
        path
        name
      }
    }
  }
  ${FilmMovieList.fragments.movie}
  ${FilmSlideshow.fragments.movie}
  ${Article.fragments.article}
`;

const getDocumentTitle = (t: TFunction, subject: GQLFilmFrontPageQuery["subject"]) =>
  htmlTitle(subject?.name, [t("htmlTitles.titleTemplate")]);

const FilmFrontpage = () => {
  const { t, i18n } = useTranslation();
  const [resourceTypeSelected, setResourceTypeSelected] = useState<MovieResourceType | undefined>(undefined);
  const [loadingPlaceholderHeight, setLoadingPlaceholderHeight] = useState<string>("");
  const movieListRef = useRef<HTMLDivElement | null>(null);

  const { data: { filmfrontpage, subject } = {}, loading } = useGraphQuery<GQLFilmFrontPageQuery>(filmFrontPageQuery, {
    variables: { subjectId: "urn:subject:20", transformArgs: { subjectId: "urn:subject:20" } },
  });

  const allResources = {
    name: t("filmfrontpage.resourcetype.all"),
    id: ALL_MOVIES_ID,
  };

  const resourceTypes = movieResourceTypes.map((rt) => ({ ...rt, name: t(rt.name) })).concat([allResources]);

  const about = filmfrontpage?.about?.find((about) => about.language === i18n.language);

  const definedSlideshowMovies = useMemo(
    () => filmfrontpage?.slideShow.filter((slideshow) => !!slideshow.metaImage),
    [filmfrontpage?.slideShow],
  );

  const onChangeResourceType = (resourceType?: string) => {
    const placeholderHeight = `${movieListRef.current?.getBoundingClientRect().height}px`;

    setLoadingPlaceholderHeight(placeholderHeight);
    setResourceTypeSelected(resourceTypes.find((rt) => rt.id === resourceType));
  };

  return (
    <>
      <Helmet>
        <title>{getDocumentTitle(t, subject)}</title>
      </Helmet>
      <SocialMediaMetadata type="website" title={subject?.name ?? ""} description={about?.description} />
      <StyledH1>{t("ndlaFilm.heading")}</StyledH1>
      <main>
        {loading ? <Spinner /> : definedSlideshowMovies ? <FilmSlideshow slideshow={definedSlideshowMovies} /> : null}
        <FilmMovieSearch
          skipToContentId={SKIP_TO_CONTENT_ID}
          topics={subject?.topics ?? []}
          resourceTypes={resourceTypes}
          resourceTypeSelected={resourceTypeSelected}
          onChangeResourceType={onChangeResourceType}
        />
        <StyledMovieList ref={movieListRef}>
          {resourceTypeSelected?.id === ALL_MOVIES_ID ? (
            <AllMoviesAlphabetically />
          ) : resourceTypeSelected ? (
            <MovieGrid resourceType={resourceTypeSelected} loadingPlaceholderHeight={loadingPlaceholderHeight} />
          ) : (
            filmfrontpage?.movieThemes?.map((theme) => (
              <FilmMovieList
                key={theme.name[0]?.name}
                name={findName(theme.name ?? [], i18n.language)}
                movies={theme.movies}
                slideForwardsLabel={t("ndlaFilm.slideForwardsLabel")}
                slideBackwardsLabel={t("ndlaFilm.slideBackwardsLabel")}
              />
            ))
          )}
        </StyledMovieList>
        {about && <AboutNdlaFilm aboutNDLAVideo={about} article={filmfrontpage?.article} />}
      </main>
    </>
  );
};

export default FilmFrontpage;
