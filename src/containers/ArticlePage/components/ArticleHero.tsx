/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from 'react';
import PropTypes from 'prop-types';
import { Hero, OneColumn, Breadcrumb, NdlaFilmHero } from '@ndla/ui';
import { HeroContentType } from '@ndla/ui/lib/Hero';
import { GQLMetaImage, GQLResourcePageQuery } from '../../../graphqlTypes';
import { Breadcrumb as BreadcrumbType } from '../../../interfaces';
interface WrapperProps {
  children: ReactNode;
  resourceType?: HeroContentType;
  ndlaFilm?: boolean;
  metaImage?: GQLMetaImage;
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

WrapperComponent.propTypes = {
  resourceType: PropTypes.string,
  ndlaFilm: PropTypes.bool,
  metaImage: PropTypes.shape({
    url: PropTypes.string,
    alt: PropTypes.string,
  }),
};

interface Props {
  ndlaFilm?: boolean;
  subject?: GQLResourcePageQuery['subject'];
  resourceType?: HeroContentType;
  metaImage?: GQLMetaImage;
  breadcrumbItems: BreadcrumbType[];
}

const ArticleHero = ({
  resourceType,
  metaImage,
  ndlaFilm,
  subject,
  breadcrumbItems,
}: Props) => (
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
            <Breadcrumb items={breadcrumbItems} invertedStyle={false}>
              <></>
            </Breadcrumb>
          )}
        </section>
      </div>
    </OneColumn>
  </WrapperComponent>
);

export default ArticleHero;
