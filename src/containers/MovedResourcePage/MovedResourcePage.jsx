/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { injectT } from '@ndla/i18n';
import { SearchResultList, OneColumn } from '@ndla/ui';

import { movedResourceQuery } from '../../queries';
import { useGraphQuery } from '../../util/runQueries';
import handleError from '../../util/handleError';
import { contentTypeMapping } from '../../util/getContentType';
import { resultsWithContentTypeBadgeAndImage } from '../SearchPage/searchHelpers';

import { ResourceShape } from '../../shapes';

const MovedResourcePage = ({ resource, t }) => {
  const isLearningpath = !!resource.learningpath;

  const { error, loading, data } = useGraphQuery(movedResourceQuery, {
    variables: { resourceId: resource.id },
  });

  const convertResourceToResult = resource => {
    return [
      {
        title: resource.name,
        url: resource.path,
        contentType: resource.resourceTypes
          .map(type => contentTypeMapping[type.id])
          .find(t => t),
        type: resource.resourceTypes.find(type => !contentTypeMapping[type.id])
          ?.name,
        breadcrumb: data.resource.breadcrumbs?.[0],
        subjects: data.resource.breadcrumbs?.map((crumb, index) => ({
          url: resource.paths[index],
          title: crumb[0],
          breadcrumb: crumb,
        })),
        ...(isLearningpath
          ? {
              id: resource.learningpath.id,
              ingress: resource.learningpath.description,
              metaImage: {
                url: resource.learningpath?.coverphoto?.url,
                alt: '',
              },
            }
          : {
              id: resource.article.id,
              ingress: resource.article.metaDescription,
              metaImage: {
                url: resource.article?.metaImage?.url,
                alt: resource.article?.metaImage?.alt,
              },
            }),
      },
    ];
  };

  if (loading) {
    return null;
  }

  if (error) {
    handleError(error);
    return `Error: ${error.message}`;
  }

  const results = resultsWithContentTypeBadgeAndImage(
    convertResourceToResult(resource),
    t,
  );

  return (
    <OneColumn>
      <h1>{t('movedResourcePage.title')}</h1>
      <div className="c-search-result">
        <SearchResultList results={results} />
      </div>
    </OneColumn>
  );
};

MovedResourcePage.propTypes = {
  resource: ResourceShape,
};

export default injectT(MovedResourcePage);
