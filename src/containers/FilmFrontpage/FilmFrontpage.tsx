/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TFunction } from "i18next";
import { useId, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import {
  BleedPageContent,
  Heading,
  Hero,
  HeroBackground,
  PageContent,
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemHiddenInput,
  RadioGroupItemText,
  RadioGroupLabel,
  RadioGroupRoot,
  Text,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { AboutNdlaFilm } from "./AboutNdlaFilm";
import { FilmContent } from "./FilmContent";
import { ALL_MOVIES_ID } from "./filmHelper";
import { MovieResourceType, movieResourceTypes } from "./resourceTypes";
import { Article } from "../../components/Article/Article";
import { PageContainer } from "../../components/Layout/PageContainer";
import { PageTitle } from "../../components/PageTitle";
import { RestrictedContent } from "../../components/RestrictedBlock";
import { useSiteTheme } from "../../components/SiteThemeContext";
import { SocialMediaMetadata } from "../../components/SocialMediaMetadata";
import { TransportationNode } from "../../components/TransportationPage/TransportationPageNode";
import { TransportationPageNodeListGrid } from "../../components/TransportationPage/TransportationPageNodeListGrid";
import { FILM_ID, SKIP_TO_CONTENT_ID } from "../../constants";
import { GQLFilmFrontPageQuery } from "../../graphqlTypes";
import { siteThemeToHeroVariant } from "../../util/siteTheme";
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

const StyledNav = styled("nav", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
  },
});

const StyledHeroBackground = styled(HeroBackground, {
  base: {
    height: "surface.large",
  },
});

const StyledPageContent = styled(PageContent, {
  base: {
    gap: "medium",
    textAlign: "center",
  },
});

const getDocumentTitle = (t: TFunction, node: NonNullable<GQLFilmFrontPageQuery["node"]>) =>
  htmlTitle(node?.name, [t("htmlTitles.titleTemplate")]);

const fromNdla = {
  id: "fromNdla",
  name: "ndlaFilm.search.categoryFromNdla",
};

export const FilmFrontpage = () => {
  const siteTheme = useSiteTheme();
  const headingId = useId();
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

  const { data: { filmfrontpage, node } = {}, loading } = useQuery<GQLFilmFrontPageQuery>(filmFrontPageQuery, {
    variables: { nodeId: FILM_ID, transformArgs: { subjectId: FILM_ID } },
  });

  const about = filmfrontpage?.about?.find((about) => about.language === i18n.language);

  const onChangeResourceType = (resourceType: MovieResourceType) => {
    const placeholderHeight = `${movieListRef.current?.getBoundingClientRect().height}px`;

    setLoadingPlaceholderHeight(placeholderHeight);
    setResourceTypeSelected([allResources].concat(movieResourceTypes).find((rt) => rt.id === resourceType.id));
  };

  const options = useMemo(() => {
    return [fromNdla].concat(movieResourceTypes).concat(allResources);
  }, [allResources]);

  return (
    <>
      {!!node && <PageTitle title={getDocumentTitle(t, node)} />}
      <SocialMediaMetadata type="website" title={node?.name ?? ""} description={about?.description} />
      <Hero variant={siteThemeToHeroVariant(siteTheme)}>
        <StyledHeroBackground />
        <StyledPageContainer asChild consumeCss>
          <main>
            <RestrictedContent context="bleed">
              <BleedPageContent>
                <StyledPageContent variant="content">
                  <Heading textStyle="heading.large" id={SKIP_TO_CONTENT_ID}>
                    {t("ndlaFilm.heading")}
                  </Heading>
                  <Text textStyle="title.medium" fontWeight="normal">
                    {t("ndlaFilm.description")}
                  </Text>
                </StyledPageContent>
              </BleedPageContent>
              <StyledNav aria-labelledby={headingId}>
                <Heading id={headingId} textStyle="heading.small" consumeCss asChild>
                  <h2>{t("ndlaFilm.topics")}</h2>
                </Heading>
                <TransportationPageNodeListGrid context="node" data-testid="film-frontpage-topics">
                  {node?.children?.map((child) => (
                    <TransportationNode key={child.id} node={child} context="frontpage" />
                  ))}
                </TransportationPageNodeListGrid>
              </StyledNav>
              <Wrapper>
                <Heading textStyle="heading.small" consumeCss asChild>
                  <h2>{t("ndlaFilm.films")}</h2>
                </Heading>
                <StyledRadioGroupRoot
                  orientation="horizontal"
                  defaultValue={resourceTypeSelected?.id}
                  onValueChange={(details) =>
                    onChangeResourceType(options.find((option) => option.id === details.value)!)
                  }
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
              {!!about && <AboutNdlaFilm aboutNDLAVideo={about} article={filmfrontpage?.article} />}
            </RestrictedContent>
          </main>
        </StyledPageContainer>
      </Hero>
    </>
  );
};

const filmFrontPageQuery = gql`
  query filmFrontPage($nodeId: String!, $transformArgs: TransformedArticleContentInput) {
    filmfrontpage {
      movieThemes {
        name {
          name
          language
        }
        movies {
          ...FilmContent_Movie
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
    node(id: $nodeId) {
      id
      name
      url
      children(nodeType: "TOPIC,CASE") {
        id
        name
        url
        ...TransportationNode_Node
      }
    }
  }
  ${FilmContent.fragments.movie}
  ${Article.fragments.article}
  ${TransportationNode.fragments.node}
`;
