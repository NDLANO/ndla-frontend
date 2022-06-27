/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from '@apollo/client';
import { ReactNode } from 'react';
import { Hero, OneColumn, NdlaFilmHero, HomeBreadcrumb } from '@ndla/ui';
import { HeroContentType } from '@ndla/ui/lib/Hero';
import {
  GQLArticleHero_MetaImageFragment,
  GQLArticleHero_SubjectFragment,
} from '../../../graphqlTypes';
import { Breadcrumb as BreadcrumbType } from '../../../interfaces';
import { useIsNdlaFilm } from '../../../routeHelpers';
interface WrapperProps {
  children: ReactNode;
  resourceType?: HeroContentType;
  ndlaFilm?: boolean;
  metaImage?: GQLArticleHero_MetaImageFragment;
}
const WrapperComponent = ({
  children,
  resourceType,
  ndlaFilm,
  metaImage,
}: WrapperProps) => {
  if (ndlaFilm) {
    return (
      <NdlaFilmHero hasImage={!!(metaImage && metaImage.url)}>
        {children}
      </NdlaFilmHero>
    );
  }

  return <Hero contentType={resourceType}>{children}</Hero>;
};

interface Props {
  subject?: GQLArticleHero_SubjectFragment;
  resourceType?: HeroContentType;
  metaImage?: GQLArticleHero_MetaImageFragment;
  breadcrumbItems: BreadcrumbType[];
}

const ArticleHero = ({
  resourceType,
  metaImage,
  subject,
  breadcrumbItems,
}: Props) => {
  const ndlaFilm = useIsNdlaFilm();
  return (
    <WrapperComponent
      ndlaFilm={ndlaFilm}
      resourceType={resourceType}
      metaImage={metaImage}>
      {ndlaFilm && metaImage && metaImage.url && (
        <div className="c-hero__background">
          <img src={metaImage.url} alt={metaImage.alt} />
        </div>
      )}
      <OneColumn>
        <div className="c-hero__content">
          <section>
            {subject && (
              <HomeBreadcrumb
                light={ndlaFilm ? ndlaFilm : undefined}
                items={breadcrumbItems}
              />
            )}
          </section>
        </div>
      </OneColumn>
    </WrapperComponent>
  );
};

ArticleHero.fragments = {
  subject: gql`
    fragment ArticleHero_Subject on Subject {
      id
    }
  `,
  metaImage: gql`
    fragment ArticleHero_MetaImage on MetaImage {
      url
      alt
    }
  `,
};

export default ArticleHero;
