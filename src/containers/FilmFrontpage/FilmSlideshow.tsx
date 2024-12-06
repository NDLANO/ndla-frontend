/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useEffect, useState } from "react";
import { gql } from "@apollo/client";
import { BleedPageContent, Image, Skeleton, Text } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { Carousel } from "./Carousel";
import FilmContentCard from "./FilmContentCard";
import { useEnablePrettyUrls } from "../../components/PrettyUrlsContext";
import { GQLFilmSlideshow_MovieFragment } from "../../graphqlTypes";

interface Props {
  slideshow: GQLFilmSlideshow_MovieFragment[] | undefined;
}

const StyledImage = styled(Image, {
  base: {
    height: "surface.large",
    objectPosition: "top",
    width: "100%",
    aspectRatio: "16/9",
    objectFit: "cover",
  },
});

const StyledText = styled(Text, {
  base: {
    backgroundColor: "surface.default",
    paddingBlock: "xsmall",
    paddingInline: "medium",

    textDecoration: "underline",
    borderBottomRadius: "xsmall",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
});

const StyledSafeLinkCard = styled(SafeLink, {
  base: {
    display: "flex",
    flexDirection: "column",
    width: "30vw",
    minWidth: "surface.3xsmall",
    border: "1px solid",
    borderColor: "stroke.default",
    backgroundColor: "surface.default",
    borderRadius: "xsmall",
    overflow: "hidden",

    transition: "all 200ms",
    transform: "translateY(10%)",
    "&[data-current='true']": {
      transform: "translateY(0%)",
    },
    _hover: {
      borderColor: "stroke.hover",
      "& > p": {
        textDecoration: "none",
      },
      "& > img": {
        opacity: "0.7",
      },
    },
  },
});

const StyledImg = styled(Image, {
  base: {
    minWidth: "surface.3xsmall",
    width: "30vw",
    height: "15vw",
    objectFit: "cover",
  },
});

const StyledSafeLink = styled(SafeLink, {
  base: {
    display: "block",
    position: "relative",
  },
});

const StyledCarousel = styled(Carousel, {
  base: {
    justifyContent: "center",
    marginBlockStart: "-large",
    tablet: {
      marginBlockStart: "-xlarge",
    },
    desktop: {
      marginBlockStart: "-3xlarge",
    },

    "& [data-slide-content-wrapper]": {
      gap: "xlarge",
      marginBottom: "3xlarge",
      marginInline: "3xlarge",
      wideDown: {
        gap: "medium",
        marginInline: "medium",
      },
    },
  },
});

const StyledInfoContainer = styled("div", {
  base: {
    position: "absolute",
    top: "35%",
    right: "max(token(spacing.medium), 5%)",
    maxWidth: "surface.large",
    marginInlineStart: "medium",
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
    alignItems: "flex-start",
    border: "1px solid",
    borderColor: "surface.brand.1",
    borderRadius: "xsmall",
    paddingBlock: "large",
    zIndex: "docked",
    backgroundColor: "primary/90",
    paddingInline: "medium",
    color: "text.onAction",
  },
});

const LoadingShimmer = () => {
  return new Array(3).fill(0).map((_, index) => {
    return (
      <Skeleton key={index}>
        <StyledSafeLinkCard data-current={false} onMouseDown={(e) => e.preventDefault()} to={""}>
          <StyledImg src={""} loading="eager" alt="" />
          <StyledText textStyle="label.large" fontWeight="bold"></StyledText>
        </StyledSafeLinkCard>
      </Skeleton>
    );
  });
};

const MainImageShimmer = () => (
  <Skeleton>
    <StyledImage src={""} sizes="(min-width: 1140px) 1140px, (min-width: 720px) 100vw, 100vw" alt="" />
  </Skeleton>
);

const FilmSlideshow = ({ slideshow }: Props) => {
  const enablePrettyUrls = useEnablePrettyUrls();
  const [currentSlide, setCurrentSlide] = useState<GQLFilmSlideshow_MovieFragment | undefined>(slideshow?.[0]);
  const [hoverCallback, setHoverCallback] = useState<ReturnType<typeof setTimeout> | undefined>(undefined);

  const onHover = useCallback(
    (movie: GQLFilmSlideshow_MovieFragment) => {
      const timeout = setTimeout(() => setCurrentSlide(movie), 500);
      setHoverCallback(timeout);
    },
    [setCurrentSlide],
  );

  useEffect(() => {
    if (!currentSlide) setCurrentSlide(slideshow?.[0]);
  }, [currentSlide, slideshow]);

  return (
    <BleedPageContent asChild consumeCss>
      <section>
        <StyledSafeLink
          to={(enablePrettyUrls ? currentSlide?.url : currentSlide?.path) ?? ""}
          tabIndex={-1}
          aria-hidden
        >
          {!currentSlide?.metaImage?.url ? (
            <MainImageShimmer />
          ) : (
            <StyledImage src={currentSlide?.metaImage?.url ?? ""} sizes="(min-width: 1140px) 1140, 1140px" alt="" />
          )}
          {!!currentSlide && (
            <StyledInfoContainer>
              <Text textStyle="heading.medium">{currentSlide?.title}</Text>
              <Text textStyle="body.xlarge">{currentSlide.metaDescription}</Text>
            </StyledInfoContainer>
          )}
        </StyledSafeLink>
        <StyledCarousel>
          {!slideshow ? (
            <LoadingShimmer />
          ) : (
            slideshow.map((movie) => {
              const to = enablePrettyUrls ? movie.url : movie.path;
              return (
                <StyledSafeLinkCard
                  data-current={movie.id === currentSlide?.id}
                  key={movie.id}
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseEnter={() => onHover(movie)}
                  onMouseLeave={() => {
                    if (hoverCallback) {
                      clearTimeout(hoverCallback);
                      setHoverCallback(undefined);
                    }
                  }}
                  onFocus={() => setCurrentSlide(movie)}
                  aria-describedby={"currentMovieDescription"}
                  to={to}
                >
                  <StyledImg
                    src={movie?.metaImage ? movie?.metaImage.url : ""}
                    sizes={"300px"}
                    loading="eager"
                    alt=""
                  />
                  <StyledText textStyle="label.large" fontWeight="bold" title={movie.title}>
                    {movie.title}
                  </StyledText>
                </StyledSafeLinkCard>
              );
            })
          )}
        </StyledCarousel>
      </section>
    </BleedPageContent>
  );
};

FilmSlideshow.fragments = {
  movie: gql`
    fragment FilmSlideshow_Movie on Movie {
      ...FilmContentCard_Movie
    }
    ${FilmContentCard.fragments.movie}
  `,
};

export default FilmSlideshow;
