/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ComponentPropsWithoutRef } from "react";
import { gql } from "@apollo/client";
import styled from "@emotion/styled";
import { spacing, colors, fonts, breakpoints, misc, mq, stackOrder } from "@ndla/core";
import { SafeLink } from "@ndla/safelink";
import { Text } from "@ndla/typography";
import { makeSrcQueryString } from "@ndla/ui";
import { movieResourceTypes } from "./resourceTypes";

export interface MovieType {
  metaImage?: {
    url: string;
  };
  resourceTypes: {
    id: string;
    name: string;
  }[];
  title: string;
  id: string | number;
  path: string;
}

interface Props extends ComponentPropsWithoutRef<"a"> {
  movie: MovieType;
  hideTags?: boolean;
  lazy?: boolean;
  type?: "slideshow" | "list";
}

const StyledMovieTitle = styled.span`
  ${fonts.size.text.metaText.small}
  font-weight: ${fonts.weight.semibold};
  color: ${colors.white};
  ${mq.range({ from: breakpoints.tablet })} {
    ${fonts.size.text.metaText.medium};
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  background-color: ${colors.ndlaFilm.filmColorLight};
  border-radius: ${misc.borderRadius};
  overflow: hidden;
`;

const StyledImage = styled.img`
  aspect-ratio: 16/9;
  width: 100%;
  object-fit: cover;
`;

const StyledSafeLink = styled(SafeLink)`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
  color: ${colors.white};
  box-shadow: none;
  &:hover,
  &:focus-within,
  &:active {
    [data-title] {
      text-decoration: underline;
    }
    [data-content-cards] {
      opacity: 1;
    }
    img {
      opacity: 0.7;
    }
  }
  &[data-type="slideshow"] {
    width: 30vw;
    ${mq.range({ until: breakpoints.tablet })} {
      width: 40vw;
    }
    ${mq.range({ from: breakpoints.desktop })} {
      width: 30vw;
    }
  }
  &[data-type="list"] {
    width: 40vw;
    ${mq.range({ from: breakpoints.tablet, until: breakpoints.desktop })} {
      width: 28vw;
    }
    ${mq.range({ from: breakpoints.desktop })} {
      width: 20vw;
    }
    ${mq.range({ from: breakpoints.ultraWide })} {
      width: 14vw;
    }
  }
`;

const StyledWrapperDiv = styled.div`
  transition: opacity 200ms ease;
  padding: ${spacing.xsmall} ${spacing.xsmall};
  opacity: 0;
  position: absolute;
  bottom: 0px;
  left: 0px;
  z-index: ${stackOrder.offsetSingle};
`;

const StyledMovieTags = styled(Text)`
  font-weight: ${fonts.weight.semibold};
  background: ${colors.brand.greyLight};
  padding: ${spacing.xxsmall} ${spacing.xsmall};
  border-radius: ${misc.borderRadius};
  color: ${colors.text.primary};
  margin: 0px ${spacing.xxsmall} ${spacing.xxsmall} 0px;
`;

const FilmContentCard = ({
  movie: { metaImage, resourceTypes, title, id, path },
  hideTags = false,
  className,
  type = "slideshow",
  lazy,
  ...rest
}: Props) => {
  const backgroundImage = metaImage ? `${metaImage.url}?${makeSrcQueryString(600)}` : "";
  const contentTypeId = `${type}-content-type-${id}`;
  const resources: Record<string, boolean> = {};
  movieResourceTypes.forEach((movieResourceType) => {
    const resource = resourceTypes.find((resourceType) => resourceType.id === movieResourceType.id);
    if (resource) {
      resources[resource.name] = true;
    }
  });

  return (
    <StyledSafeLink
      onMouseDown={(e) => e.preventDefault()}
      to={path}
      data-type={type}
      aria-describedby={contentTypeId}
      className={className}
      {...rest}
    >
      <ImageWrapper>
        <StyledImage src={backgroundImage} loading={lazy ? "lazy" : "eager"} alt="" />
        {movieResourceTypes && !hideTags && (
          <StyledWrapperDiv id={`${id}`} data-content-cards="">
            {Object.keys(resources).map((resourceName) => (
              <StyledMovieTags element="span" textStyle="meta-text-small" key={resourceName}>
                {resourceName}
              </StyledMovieTags>
            ))}
          </StyledWrapperDiv>
        )}
      </ImageWrapper>
      <StyledMovieTitle data-title="">{title}</StyledMovieTitle>
    </StyledSafeLink>
  );
};

FilmContentCard.fragments = {
  movie: gql`
    fragment FilmContentCard_Movie on Movie {
      id
      title
      metaImage {
        alt
        url
      }
      metaDescription
      resourceTypes {
        id
        name
      }
      path
    }
  `,
};

export default FilmContentCard;
