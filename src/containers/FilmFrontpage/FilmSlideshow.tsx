/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useState } from "react";
import { gql } from "@apollo/client";
import styled from "@emotion/styled";
import { IconButtonV2 } from "@ndla/button";
import { Carousel } from "@ndla/carousel";
import { breakpoints, colors, misc, mq, spacing } from "@ndla/core";
import { ChevronLeft, ChevronRight } from "@ndla/icons/common";
import { SafeLink } from "@ndla/safelink";
import { Image } from "@ndla/ui";
import FilmContentCard from "./FilmContentCard";
import { GQLFilmSlideshow_MovieFragment } from "../../graphqlTypes";

interface Props {
  slideshow: GQLFilmSlideshow_MovieFragment[];
}

const SlideInfoWrapper = styled.div`
  position: absolute;
  color: ${colors.white};
  max-width: 40%;
  min-width: 40%;
  top: 40%;
  right: 5%;
  ${mq.range({ until: breakpoints.desktop })} {
    top: 30%;
    max-width: 60%;
    min-width: 60%;
  }
  ${mq.range({ until: breakpoints.tablet })} {
    max-width: 90%;
    min-width: 90%;
    left: 5%;
  }
`;

const StyledSafeLink = styled(SafeLink)`
  position: relative;
  display: block;
  box-shadow: none;
`;

const InfoWrapper = styled.div`
  padding: ${spacing.normal};
  border-radius: ${misc.borderRadius};
  border: 0.5px solid ${colors.brand.primary};
  background-color: rgba(11, 29, 45, 0.8);
  h3 {
    margin: 0px;
  }
`;

const StyledImg = styled(Image)`
  max-height: 600px;
  min-height: 600px;
  object-position: top;
  width: 100%;
  aspect-ratio: 16/9;
  ${mq.range({ until: breakpoints.tablet })} {
    min-height: 440px;
    max-height: 440px;
  }
  object-fit: cover;
`;

const CarouselContainer = styled.div`
  margin-top: -50px;
  ${mq.range({ from: breakpoints.tablet })} {
    margin-top: -70px;
  }
  ${mq.range({ from: breakpoints.desktop })} {
    margin-top: -160px;
  }
`;

const SlideshowButton = styled(IconButtonV2)`
  margin-top: ${spacing.normal};
`;

const StyledFilmContentCard = styled(FilmContentCard)`
  margin-bottom: 2%;
  transition: all 200ms;
  transform: translateY(10%);
  &[data-current="true"] {
    transform: translateY(0%);
  }
`;

const FilmSlideshow = ({ slideshow }: Props) => {
  const [currentSlide, setCurrentSlide] = useState<GQLFilmSlideshow_MovieFragment>(slideshow[0]!);

  return (
    <section>
      <StyledSafeLink to={currentSlide.path} tabIndex={-1} aria-hidden>
        <StyledImg
          src={currentSlide.metaImage?.url ?? ""}
          sizes="(min-width: 1140px) 1140px, (min-width: 720px) 100vw, 100vw"
          alt=""
        />
        <SlideInfoWrapper>
          <InfoWrapper>
            <h3>{currentSlide.title}</h3>
            <span id="currentMovieDescription">{currentSlide.metaDescription}</span>
          </InfoWrapper>
        </SlideInfoWrapper>
      </StyledSafeLink>
      <CarouselContainer>
        <Carousel
          leftButton={
            <SlideshowButton aria-label="">
              <ChevronLeft />
            </SlideshowButton>
          }
          rightButton={
            <SlideshowButton aria-label="">
              <ChevronRight />
            </SlideshowButton>
          }
          items={slideshow.map((movie) => (
            <FilmCard
              key={movie.id}
              current={movie.id === currentSlide.id}
              movie={movie}
              setCurrentSlide={setCurrentSlide}
            />
          ))}
        />
      </CarouselContainer>
    </section>
  );
};

interface FilmCardProps {
  setCurrentSlide: (movie: GQLFilmSlideshow_MovieFragment) => void;
  movie: GQLFilmSlideshow_MovieFragment;
  current: boolean;
}

const FilmCard = ({ setCurrentSlide, movie, current }: FilmCardProps) => {
  const [hoverCallback, setHoverCallback] = useState<ReturnType<typeof setTimeout> | undefined>(undefined);

  const onHover = useCallback(() => {
    const timeout = setTimeout(() => setCurrentSlide(movie), 500);
    setHoverCallback(timeout);
  }, [movie, setCurrentSlide]);

  return (
    <StyledFilmContentCard
      onMouseEnter={onHover}
      onMouseLeave={() => {
        if (hoverCallback) {
          clearTimeout(hoverCallback);
          setHoverCallback(undefined);
        }
      }}
      onFocus={() => setCurrentSlide(movie)}
      data-current={current}
      hideTags
      aria-describedby={"currentMovieDescription"}
      key={movie.id}
      movie={movie}
    />
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
