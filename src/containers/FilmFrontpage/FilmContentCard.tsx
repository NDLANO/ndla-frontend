/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";
import { Text, Image } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";

interface MovieType {
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

interface Props {
  movie: MovieType;
}

const ImageWrapper = styled("div", {
  base: {
    position: "relative",
    overflow: "hidden",
    borderRadius: "4px",
  },
});

const StyledImage = styled(Image, {
  base: {
    maxHeight: "surface.xxsmall",
    minHeight: "surface.xxsmall",
    minWidth: "surface.small",
    maxWidth: "surface.small",
  },
});

const StyledSafeLink = styled(SafeLink, {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",

    width: "40vw",
    tabletToDesktop: {
      width: "28vw",
    },
    desktop: {
      width: "20vw",
    },

    _hover: {
      "& > *": {
        textDecoration: "none",
      },
    },
  },
});

const StyledText = styled(Text, {
  base: {
    textDecoration: "underline",
  },
});

const FilmContentCard = ({ movie: { metaImage, title, id, path } }: Props) => {
  return (
    <StyledSafeLink onMouseDown={(e) => e.preventDefault()} to={path} aria-describedby={`list-content-type-${id}`}>
      <ImageWrapper>
        <StyledImage src={metaImage?.url ?? ""} loading="lazy" alt="" />
      </ImageWrapper>
      <StyledText fontWeight="bold" textStyle="label.medium">
        {title}
      </StyledText>
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
