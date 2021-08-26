/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Hero, OneColumn, Breadcrumb, NdlaFilmHero } from '@ndla/ui';
import { withRouter } from 'react-router-dom';
import {
  BreadCrumbShape,
  LocationShape,
  ResourceShape,
  SubjectShape,
  TopicShape,
} from '../../../shapes';

const WrapperComponent = ({ children, resourceType, ndlaFilm, metaImage }) => {
  if (ndlaFilm) {
    return (
      <NdlaFilmHero hasImage={metaImage && metaImage.url}>
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

const ArticleHero = ({
  resource,
  resourceType,
  metaImage,
  ndlaFilm,
  subject,
  topicPath,
  location,
  locale,
  breadcrumbItems,
}) => (
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
        <section>{subject && <Breadcrumb items={breadcrumbItems} />}</section>
      </div>
    </OneColumn>
  </WrapperComponent>
);

ArticleHero.propTypes = {
  resource: ResourceShape.isRequired,
  resourceType: PropTypes.string,
  subject: SubjectShape,
  topicPath: PropTypes.arrayOf(TopicShape),
  location: LocationShape,
  locale: PropTypes.string,
  metaImage: PropTypes.shape({
    url: PropTypes.string,
    alt: PropTypes.string,
  }),
  breadcrumbItems: PropTypes.arrayOf(BreadCrumbShape),
  ndlaFilm: PropTypes.bool,
};
export default withRouter(ArticleHero);
