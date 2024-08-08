/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TFunction } from "i18next";
import { useId, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { Heading, Skeleton } from "@ndla/primitives";
import { SafeLinkButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { OneColumn } from "@ndla/ui";
import AboutNdlaFilm from "./AboutNdlaFilm";
import { FilmContent } from "./FilmContent";
import FilmFiltering from "./FilmFiltering";
import { ALL_MOVIES_ID } from "./filmHelper";
import FilmMovieList from "./FilmMovieList";
import FilmSlideshow from "./FilmSlideshow";
import { MovieResourceType, movieResourceTypes } from "./resourceTypes";
import Article from "../../components/Article";
import SocialMediaMetadata from "../../components/SocialMediaMetadata";
import { SKIP_TO_CONTENT_ID } from "../../constants";
import { GQLFilmFrontPageQuery } from "../../graphqlTypes";
import { useGraphQuery } from "../../util/runQueries";
import { htmlTitle } from "../../util/titleHelper";

const StyledUl = styled("ul", {
  base: {
    display: "grid",
    gap: "medium",

    gridTemplateColumns: "1fr 1fr 1fr",
    tabletDown: {
      gridTemplateColumns: "1fr 1fr",
    },
  },
});

const StyledSafeLinkButton = styled(SafeLinkButton, {
  base: {
    width: "100%",
    justifyContent: "flex-start",
  },
});

const StyledNav = styled("nav", {
  base: {
    display: "flex",
    gap: "4xsmall",
    flexDirection: "column",
    paddingTop: "medium",
    paddingBottom: "xxlarge",
  },
});

const ContentWrapper = styled("div", {
  base: {
    width: "100%",
    marginTop: "medium",
  },
});

const getDocumentTitle = (t: TFunction, subject: GQLFilmFrontPageQuery["subject"]) =>
  htmlTitle(subject?.name, [t("htmlTitles.titleTemplate")]);

const fromNdla = {
  id: "fromNdla",
  name: "ndlaFilm.search.categoryFromNdla",
};

const TopicLoadingShimmer = () => {
  return new Array(8).fill(0).map((_, idx) => (
    <li key={idx}>
      <Skeleton>
        <StyledSafeLinkButton to={""}>loading</StyledSafeLinkButton>
      </Skeleton>
    </li>
  ));
};

const FilmFrontpage = () => {
  const allResources = useMemo(
    () => ({
      name: "filmfrontpage.resourcetype.all",
      id: ALL_MOVIES_ID,
    }),
    [],
  );

  const { t, i18n } = useTranslation();
  const [resourceTypeSelected, setResourceTypeSelected] = useState<MovieResourceType | undefined>(fromNdla);
  const [loadingPlaceholderHeight, setLoadingPlaceholderHeight] = useState<string>("");
  const movieListRef = useRef<HTMLDivElement | null>(null);

  const { data: { filmfrontpage, subject } = {}, loading } = useGraphQuery<GQLFilmFrontPageQuery>(filmFrontPageQuery, {
    variables: { subjectId: "urn:subject:20", transformArgs: { subjectId: "urn:subject:20" } },
  });

  const about = filmfrontpage?.about?.find((about) => about.language === i18n.language);

  const definedSlideshowMovies = useMemo(
    () => filmfrontpage?.slideShow.filter((slideshow) => !!slideshow.metaImage),
    [filmfrontpage?.slideShow],
  );

  const onChangeResourceType = (resourceType: MovieResourceType) => {
    const placeholderHeight = `${movieListRef.current?.getBoundingClientRect().height}px`;

    setLoadingPlaceholderHeight(placeholderHeight);
    setResourceTypeSelected([allResources].concat(movieResourceTypes).find((rt) => rt.id === resourceType.id));
  };

  const options = useMemo(() => {
    return [fromNdla, allResources].concat(movieResourceTypes);
  }, [allResources]);

  const navHeadingId = useId();

  return (
    <>
      <Helmet>
        <title>{getDocumentTitle(t, subject)}</title>
      </Helmet>
      <SocialMediaMetadata type="website" title={subject?.name ?? ""} description={about?.description} />
      <main>
        <FilmSlideshow slideshow={definedSlideshowMovies} />
        <OneColumn wide>
          <Heading textStyle="heading.medium" id={SKIP_TO_CONTENT_ID}>
            {t("ndlaFilm.heading")}
          </Heading>
          <StyledNav aria-labelledby={navHeadingId}>
            <Heading id={navHeadingId} textStyle="title.large" fontWeight="bold" asChild consumeCss>
              <h2>{t("ndlaFilm.topics")}</h2>
            </Heading>
            {/* TODO: Investigate if this should look like `transportsider` in figma instead of this design */}
            <StyledUl data-testid="film-subject-list">
              {loading ? (
                <TopicLoadingShimmer />
              ) : (
                subject?.topics?.map((topic) => (
                  <li key={topic.id}>
                    <StyledSafeLinkButton to={topic.path}>{topic.name}</StyledSafeLinkButton>
                  </li>
                ))
              )}
            </StyledUl>
          </StyledNav>
          <FilmFiltering
            options={options}
            onOptionSelected={onChangeResourceType}
            selectedOption={resourceTypeSelected}
          />
        </OneColumn>
        <ContentWrapper ref={movieListRef}>
          <FilmContent
            resourceTypeSelected={resourceTypeSelected}
            movieThemes={filmfrontpage?.movieThemes}
            loading={loading}
            loadingPlaceholderHeight={loadingPlaceholderHeight}
          />
        </ContentWrapper>
        {about && <AboutNdlaFilm loading={loading} aboutNDLAVideo={about} article={filmfrontpage?.article} />}
      </main>
    </>
  );
};

export default FilmFrontpage;

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
