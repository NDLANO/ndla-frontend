/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { SearchResultList, OneColumn, Image } from '@ndla/ui';

import { movedResourceQuery } from '../../queries';
import { useGraphQuery } from '../../util/runQueries';
import handleError from '../../util/handleError';

import { ResourceShape } from '../../shapes';

const MovedResourcePage = ({ resource, locale, t }) => {
  const isLearningpath = !!resource.learningpath;

  const { error, loading, data } = useGraphQuery(movedResourceQuery, {
    variables: { resourceId: resource.id }
  })

  const getImage = metaImage => 
    <Image src={metaImage?.url} alt={metaImage?.alt} />

  const convertResourceToResult = resource => {
    return [{
      ...resource,
      title: resource.name,
      url: resource.path,
      breadcrumb: data.resource.breadcrumbs?.[0],
      subjects: data.resource.breadcrumbs?.map((crumb, index) => ({
        url: resource.paths[index],
        title: crumb[0],
        breadcrumb: crumb,
      })),
      ...(isLearningpath ? {
        ingress: resource.learningpath.description,
        image: getImage({ url: data.resource.learningpath?.coverphoto?.url, alt: '' }),
      } : {
        ingress: resource.article.metaDescription,
        image: getImage(resource.article.metaImage)
      })
    }]
  }

  if (loading) {
    return null;
  }

  if (error) {
    handleError(error);
    return `Error: ${error.message}`;
  }

  return (
    <OneColumn>
      <h1>{t('movedResourcePage.title')}</h1>
      <div className="c-search-result">
        <SearchResultList results={convertResourceToResult(resource)} />
      </div>
    </OneColumn>
  );
};

const searchResultItemShape = PropTypes.shape({
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  url: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  breadcrumb: PropTypes.arrayOf(PropTypes.string),
  subjects: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      url: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    }),
  ),
  additional: PropTypes.bool,
  image: PropTypes.node,
  ingress: PropTypes.string.isRequired,
  contentTypeIcon: PropTypes.node.isRequired,
  contentTypeLabel: PropTypes.string.isRequired,
});

MovedResourcePage.propTypes = {
  resource: ResourceShape,
  locale: PropTypes.string.isRequired,
};

export default injectT(MovedResourcePage);
