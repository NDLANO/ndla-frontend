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
import { Heading, Spinner } from "@ndla/primitives";
import { SafeLinkButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { OneColumn } from "@ndla/ui";
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
    justifyContent: "start",
    paddingInline: "medium",
    paddingBlock: "xsmall",
  },
});

const StyledNav = styled("nav", {
  base: {
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

  return (
    <>
      <Helmet>
        <title>{getDocumentTitle(t, subject)}</title>
      </Helmet>
      <SocialMediaMetadata type="website" title={subject?.name ?? ""} description={about?.description} />
      <main>
        {loading ? <Spinner /> : definedSlideshowMovies ? <FilmSlideshow slideshow={definedSlideshowMovies} /> : null}
        <OneColumn wide>
          <Heading textStyle="heading.medium" id={SKIP_TO_CONTENT_ID}>
            {t("ndlaFilm.heading")}
          </Heading>
          <StyledNav>
            <Heading textStyle="title.large" fontWeight="bold" asChild consumeCss>
              <span>{t("ndlaFilm.topics")}</span>
            </Heading>
            <StyledUl data-testid="film-subject-list">
              {subject?.topics?.map((topic) => (
                <li key={topic.id}>
                  <StyledSafeLinkButton to={topic.path}>{topic.name}</StyledSafeLinkButton>
                </li>
              ))}
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
            loadingPlaceholderHeight={loadingPlaceholderHeight}
          />
        </ContentWrapper>
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
