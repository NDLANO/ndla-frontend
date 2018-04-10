/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import defined from 'defined';
import { Hero, OneColumn, Breadcrumb } from 'ndla-ui';

import getContentTypeFromResourceTypes from '../../../util/getContentTypeFromResourceTypes';
import { toBreadcrumbItems } from '../../../routeHelpers';
import { ResourceTypeShape, SubjectShape, TopicShape } from '../../../shapes';

const ArticleHero = ({ resource, subject, topicPath }) => {
  const resourceTypeMetaData = getContentTypeFromResourceTypes(
    defined(resource.resourceTypes, []),
  );
  return (
    <Hero contentType={resourceTypeMetaData.contentType}>
      <OneColumn>
        <div className="c-hero__content">
          <section>
            {subject ? (
              <Breadcrumb
                items={toBreadcrumbItems(subject, topicPath, resource)}
              />
            ) : null}
          </section>
        </div>
      </OneColumn>
    </Hero>
  );
};

ArticleHero.propTypes = {
  resource: PropTypes.shape({
    resourceTypes: PropTypes.arrayOf(ResourceTypeShape),
  }).isRequired,
  subject: SubjectShape,
  topicPath: PropTypes.arrayOf(TopicShape),
};
export default ArticleHero;
