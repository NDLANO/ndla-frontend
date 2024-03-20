/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from "react";
import { gql } from "@apollo/client";
import styled from "@emotion/styled";
import { stackOrder } from "@ndla/core";
import { Hero, HeroContent, HeroContentType, HomeBreadcrumb, NdlaFilmHero, OneColumn } from "@ndla/ui";
import { GQLArticleHero_MetaImageFragment } from "../../../graphqlTypes";
import { Breadcrumb as BreadcrumbType } from "../../../interfaces";
import { useIsNdlaFilm } from "../../../routeHelpers";

interface WrapperProps {
  children: ReactNode;
  resourceType?: HeroContentType;
  ndlaFilm?: boolean;
  metaImage?: GQLArticleHero_MetaImageFragment;
}
const WrapperComponent = ({ children, resourceType, ndlaFilm, metaImage }: WrapperProps) => {
  if (ndlaFilm) {
    return <NdlaFilmHero hasImage={!!(metaImage && metaImage.url)}>{children}</NdlaFilmHero>;
  }

  return <Hero contentType={resourceType}>{children}</Hero>;
};

const HeroBackground = styled.div`
  position: absolute;
  width: 100%;
  img {
    display: block;
    width: 100%;
    opacity: 0.4;
    max-width: 1460px;
    margin: 0 auto;
  }

  &:after {
    content: "";
    position: absolute;
    display: block;
    background-image: linear-gradient(#091a2a00, #091a2aff);
    width: 100%;
    height: 100px;
    bottom: 0px;
  }
`;

interface Props {
  resourceType?: HeroContentType;
  metaImage?: GQLArticleHero_MetaImageFragment;
  breadcrumbItems: BreadcrumbType[];
}

const StyledSection = styled.section`
  z-index: ${stackOrder.offsetSingle};
`;

const ArticleHero = ({ resourceType, metaImage, breadcrumbItems }: Props) => {
  const ndlaFilm = useIsNdlaFilm();
  return (
    <WrapperComponent ndlaFilm={ndlaFilm} resourceType={resourceType} metaImage={metaImage}>
      {ndlaFilm && metaImage?.url && (
        <HeroBackground>
          <img src={metaImage.url} alt="" />
        </HeroBackground>
      )}
      <OneColumn>
        <HeroContent data-image={!!(ndlaFilm && metaImage?.url)}>
          <StyledSection>
            {<HomeBreadcrumb light={ndlaFilm ? true : undefined} items={breadcrumbItems} />}
          </StyledSection>
        </HeroContent>
      </OneColumn>
    </WrapperComponent>
  );
};

ArticleHero.fragments = {
  metaImage: gql`
    fragment ArticleHero_MetaImage on MetaImage {
      url
      alt
    }
  `,
};

export default ArticleHero;
