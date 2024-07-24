/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useState } from "react";
import { gql } from "@apollo/client";
import { Image, Text } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { OneColumn } from "@ndla/ui";
import { Carousel } from "./Carousel";
import FilmContentCard from "./FilmContentCard";
import { GQLFilmSlideshow_MovieFragment } from "../../graphqlTypes";

interface Props {
  slideshow: GQLFilmSlideshow_MovieFragment[];
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
    paddingBlock: "xxsmall",
    paddingInline: "xxsmall",
    textDecoration: "underline",
    borderBottomRadius: "4px",
  },
});

const StyledSafeLinkCard = styled(SafeLink, {
  base: {
    maxHeight: "surface.xxsmall",
    minHeight: "surface.xxsmall",
    minWidth: "surface.small",
    maxWidth: "surface.small",

    display: "flex",
    flexDirection: "column",

    border: "1px solid",
    borderColor: "stroke.default",
    borderRadius: "4px",

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

const ImageWrapper = styled("div", {
  base: {
    position: "relative",
    overflowY: "hidden",
    borderTopRadius: "4px",
  },
});

const StyledCarousel = styled(Carousel, {
  base: {
    justifyContent: "center",
    paddingInline: "unset",
    paddingBlockEnd: "medium",
    marginBlockStart: "-large",
    tablet: {
      marginBlockStart: "-xlarge",
    },
    desktop: {
      marginBlockStart: "-3xlarge",
    },
  },
});

const FilmSlideshow = ({ slideshow }: Props) => {
  const [currentSlide, setCurrentSlide] = useState<GQLFilmSlideshow_MovieFragment>(slideshow[0]!);
  const [hoverCallback, setHoverCallback] = useState<ReturnType<typeof setTimeout> | undefined>(undefined);

  const onHover = useCallback(
    (movie: GQLFilmSlideshow_MovieFragment) => {
      const timeout = setTimeout(() => setCurrentSlide(movie), 500);
      setHoverCallback(timeout);
    },
    [setCurrentSlide],
  );

  return (
    <section>
      <SafeLink to={currentSlide.path} tabIndex={-1} aria-hidden>
        <ImageWrapper>
          <StyledImage
            src={currentSlide.metaImage?.url ?? ""}
            sizes="(min-width: 1140px) 1140px, (min-width: 720px) 100vw, 100vw"
            alt=""
          />
        </ImageWrapper>
      </SafeLink>
      <OneColumn wide>
        <StyledCarousel hideButtons={true}>
          {slideshow.map((movie) => (
            <StyledSafeLinkCard
              data-current={movie.id === currentSlide.id}
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
              <ImageWrapper>
                <Image src={movie?.metaImage ? movie?.metaImage.url : ""} loading="eager" alt="" />
              </ImageWrapper>
              <StyledText textStyle="label.large" fontWeight="bold">
                {movie.title}
              </StyledText>
            </StyledSafeLinkCard>
          ))}
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
