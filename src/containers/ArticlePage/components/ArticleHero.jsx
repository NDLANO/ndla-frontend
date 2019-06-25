/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { Hero, OneColumn, Breadcrumb, NdlaFilmHero } from '@ndla/ui';
import { withRouter } from 'react-router-dom';
import { getContentType } from '../../../util/getContentType';
import { toBreadcrumbItems } from '../../../routeHelpers';
import {
  ResourceTypeShape,
  SubjectShape,
  TopicShape,
  LocationShape,
} from '../../../shapes';
import { getFiltersFromUrl } from '../../../util/filterHelper';

const WrapperComponent = ({ children, resource, ndlaFilm, metaImage }) => {
  if (ndlaFilm) {
    return (
      <NdlaFilmHero hasImage={metaImage && metaImage.url}>
        {children}
      </NdlaFilmHero>
    );
  }
  return <Hero contentType={getContentType(resource)}>{children}</Hero>;
};

WrapperComponent.propTypes = {
  resource: PropTypes.shape({
    resourceTypes: PropTypes.arrayOf(ResourceTypeShape),
  }).isRequired,
  ndlaFilm: PropTypes.bool,
  metaImage: PropTypes.shape({
    url: PropTypes.string,
    alt: PropTypes.string,
  }),
};

const ArticleHero = ({
  resource,
  metaImage,
  ndlaFilm,
  subject,
  topicPath,
  location,
  t,
}) => (
  <WrapperComponent
    ndlaFilm={ndlaFilm}
    resource={resource}
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
            <Breadcrumb
              items={toBreadcrumbItems(
                t('breadcrumb.toFrontpage'),
                [subject, ...topicPath],
                getFiltersFromUrl(location),
              )}
            />
          )}
        </section>
      </div>
    </OneColumn>
  </WrapperComponent>
);

ArticleHero.propTypes = {
  resource: PropTypes.shape({
    resourceTypes: PropTypes.arrayOf(ResourceTypeShape),
  }).isRequired,
  subject: SubjectShape,
  topicPath: PropTypes.arrayOf(TopicShape),
  location: LocationShape,
  metaImage: PropTypes.shape({
    url: PropTypes.string,
    alt: PropTypes.string,
  }),
  ndlaFilm: PropTypes.bool,
};
export default withRouter(injectT(ArticleHero));
