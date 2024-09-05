/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";
import { Text, Image } from "@ndla/primitives";
import { SafeLink, SafeLinkProps } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { JsxStyleProps, StyledVariantProps } from "@ndla/styled-system/types";
import { movieResourceTypes } from "./resourceTypes";

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

interface Props extends JsxStyleProps, Omit<SafeLinkProps, "to">, StyledVariantProps<typeof StyledSafeLink> {
  movie: MovieType;
}

const ImageWrapper = styled("div", {
  base: {
    position: "relative",
    overflow: "hidden",
    borderRadius: "xsmall",
  },
});

const StyledImage = styled(Image, {
  base: {
    aspectRatio: "16/9",
    width: "100%",
    objectFit: "cover",
  },
});

const StyledSafeLink = styled(SafeLink, {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",

    "&:hover,&:active,&:focus-within": {
      "& [data-content-cards]": {
        opacity: "1",
      },
      "& img": {
        opacity: "0.7",
      },
      "& [data-title]": {
        textDecoration: "none",
      },
    },
  },
  variants: {
    autoSize: {
      true: {
        width: "40vw",
        tabletToDesktop: {
          width: "28vw",
        },
        desktop: {
          width: "20vw",
        },
      },
    },
  },
});

const StyledWrapperDiv = styled("div", {
  base: {
    transition: "opacity 200ms ease",
    padding: "xxsmall",
    opacity: "0",
    position: "absolute",
    bottom: "0",
    left: "0",
  },
});

const StyledMovieTags = styled(Text, {
  base: {
    fontWeight: "semibold",
    background: "background.default",
    paddingInline: "xxsmall",
    paddingBlock: "3xsmall",
    borderRadius: "xsmall",
  },
});

const StyledText = styled(Text, {
  base: {
    textDecoration: "underline",
  },
});

const mappedResourceTypes = movieResourceTypes.reduce<Record<string, string>>((acc, resourceType) => {
  acc[resourceType.id] = resourceType.name;
  return acc;
}, {});

const FilmContentCard = ({ movie: { metaImage, title, id, path, resourceTypes }, ...rest }: Props) => {
  const resources = resourceTypes.reduce<string[]>((acc, curr) => {
    const name = mappedResourceTypes[curr.id];
    if (name) return acc.concat(curr.name);
    return acc;
  }, []);

  return (
    <StyledSafeLink onMouseDown={(e) => e.preventDefault()} {...rest} to={path}>
      <ImageWrapper>
        <StyledImage src={metaImage?.url ?? ""} sizes={"400px"} loading="lazy" alt="" />
        <StyledWrapperDiv id={`${id}`} data-content-cards="">
          {resources.map((resource) => (
            <StyledMovieTags textStyle="label.small" key={resource}>
              {resource}
            </StyledMovieTags>
          ))}
        </StyledWrapperDiv>
      </ImageWrapper>
      <StyledText fontWeight="bold" textStyle="label.medium" data-title="">
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
