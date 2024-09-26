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
import {
  Heading,
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemHiddenInput,
  RadioGroupItemText,
  RadioGroupLabel,
  RadioGroupRoot,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import AboutNdlaFilm from "./AboutNdlaFilm";
import { FilmContent } from "./FilmContent";
import { ALL_MOVIES_ID } from "./filmHelper";
import FilmMovieList from "./FilmMovieList";
import FilmSlideshow from "./FilmSlideshow";
import { MovieResourceType, movieResourceTypes } from "./resourceTypes";
import Article from "../../components/Article";
import { PageContainer } from "../../components/Layout/PageContainer";
import NavigationBox from "../../components/NavigationBox";
import { useEnablePrettyUrls } from "../../components/PrettyUrlsContext";
import SocialMediaMetadata from "../../components/SocialMediaMetadata";
import { FILM_ID, SKIP_TO_CONTENT_ID } from "../../constants";
import { GQLFilmFrontPageQuery } from "../../graphqlTypes";
import { useGraphQuery } from "../../util/runQueries";
import { htmlTitle } from "../../util/titleHelper";

const Wrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "medium",
  },
});

const StyledPageContainer = styled(PageContainer, {
  base: {
    paddingBlockStart: "0px",
    gap: "xxlarge",
  },
});

const RadioButtonWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "small",
    flexWrap: "wrap",
  },
});

const StyledRadioGroupRoot = styled(RadioGroupRoot, {
  base: {
    _horizontal: {
      flexDirection: "column",
    },
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
  const enablePrettyUrls = useEnablePrettyUrls();
  const [resourceTypeSelected, setResourceTypeSelected] = useState<MovieResourceType | undefined>(fromNdla);
  const [loadingPlaceholderHeight, setLoadingPlaceholderHeight] = useState<string>("");
  const movieListRef = useRef<HTMLDivElement | null>(null);

  const { data: { filmfrontpage, subject } = {}, loading } = useGraphQuery<GQLFilmFrontPageQuery>(filmFrontPageQuery, {
    variables: { subjectId: FILM_ID, transformArgs: { subjectId: FILM_ID } },
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
      <StyledPageContainer asChild consumeCss>
        <main>
          <FilmSlideshow slideshow={definedSlideshowMovies} />
          <Wrapper>
            <Heading textStyle="heading.medium" id={SKIP_TO_CONTENT_ID}>
              {t("ndlaFilm.heading")}
            </Heading>
            <NavigationBox
              heading={t("ndlaFilm.topics")}
              items={subject?.topics?.map((topic) => {
                const path = enablePrettyUrls ? topic.url : topic.path;
                return {
                  label: topic.name,
                  url: path,
                };
              })}
            />
          </Wrapper>
          <Wrapper>
            <Heading textStyle="heading.small" consumeCss asChild>
              <h2>{t("ndlaFilm.films")}</h2>
            </Heading>
            <StyledRadioGroupRoot
              orientation="horizontal"
              defaultValue={resourceTypeSelected?.id}
              onValueChange={(details) => onChangeResourceType(options.find((option) => option.id === details.value)!)}
            >
              <RadioGroupLabel textStyle="label.large" fontWeight="bold">
                {t("ndlaFilm.filterFilms")}
              </RadioGroupLabel>
              <RadioButtonWrapper>
                {options.map((category, index) => (
                  <RadioGroupItem key={`${category.id}-${index}`} value={category.id}>
                    <RadioGroupItemControl />
                    <RadioGroupItemText>{t(category.name)}</RadioGroupItemText>
                    <RadioGroupItemHiddenInput />
                  </RadioGroupItem>
                ))}
              </RadioButtonWrapper>
            </StyledRadioGroupRoot>
          </Wrapper>
          <FilmContent
            resourceTypeSelected={resourceTypeSelected}
            movieThemes={filmfrontpage?.movieThemes}
            loading={loading}
            loadingPlaceholderHeight={loadingPlaceholderHeight}
          />
          {about && <AboutNdlaFilm aboutNDLAVideo={about} article={filmfrontpage?.article} />}
        </main>
      </StyledPageContainer>
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
    subject: node(id: $subjectId) {
      id
      name
      path
      url
      topics: children(nodeType: "TOPIC") {
        id
        name
        path
        url
      }
    }
  }
  ${FilmMovieList.fragments.movie}
  ${FilmSlideshow.fragments.movie}
  ${Article.fragments.article}
`;
