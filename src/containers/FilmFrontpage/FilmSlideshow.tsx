/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useEffect, useState } from "react";
import { gql } from "@apollo/client";
import { Image, Skeleton, Text } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { OneColumn } from "@ndla/ui";
import { Carousel } from "./Carousel";
import FilmContentCard from "./FilmContentCard";
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
    borderBottomRadius: "4",
  },
});

const StyledSafeLinkCard = styled(SafeLink, {
  base: {
    display: "flex",
    flexDirection: "column",
    width: "340px",

    border: "1px solid",
    borderColor: "stroke.default",
    borderRadius: "4",

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
    },
  },
});

const StyledImg = styled("img", {
  base: {
    width: "340px",
    height: "170px",
    objectFit: "cover",
    borderTopRadius: "4",
  },
});

const StyledCarousel = styled(Carousel, {
  base: {
    justifyContent: "center",
    paddingBlockEnd: "medium",
    marginBlockStart: "-large",
    tablet: {
      marginBlockStart: "-xlarge",
    },
    desktop: {
      marginBlockStart: "-3xlarge",
    },

    "& > div > div": {
      gap: "xlarge",
      marginBottom: "3xlarge",
    },
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
    <section>
      <SafeLink to={currentSlide?.path ?? ""} tabIndex={-1} aria-hidden>
        {!currentSlide?.metaImage?.url ? (
          <MainImageShimmer />
        ) : (
          <StyledImage
            src={currentSlide?.metaImage?.url ?? ""}
            sizes="(min-width: 1140px) 1140px, (min-width: 720px) 100vw, 100vw"
            alt=""
          />
        )}
      </SafeLink>
      <OneColumn wide>
        <StyledCarousel>
          {!slideshow ? (
            <LoadingShimmer />
          ) : (
            slideshow.map((movie) => (
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
                to={movie.path}
              >
                <StyledImg src={movie?.metaImage ? movie?.metaImage.url : ""} loading="eager" alt="" />
                <StyledText textStyle="label.large" fontWeight="bold">
                  {movie.title}
                </StyledText>
              </StyledSafeLinkCard>
            ))
          )}
        </StyledCarousel>
      </OneColumn>
    </section>
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
