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
import { injectT } from 'ndla-i18n';
import { Hero, OneColumn, Breadcrumb } from 'ndla-ui';

import getContentTypeFromResourceTypes from '../../../components/getContentTypeFromResourceTypes';
import { toTopic } from '../../../routeHelpers';
import { ResourceTypeShape, SubjectShape, TopicShape } from '../../../shapes';

const ArticleHero = ({ article, subject, topicPath, t }) => {
  const resourceTypeMetaData = getContentTypeFromResourceTypes(
    defined(article.resourceTypes, []),
  );
  return (
    <Hero contentType={resourceTypeMetaData.contentType}>
      <OneColumn cssModifier="narrow">
        <div className="c-hero__content">
          <section>
            {subject ? (
              <Breadcrumb
                toSubjects={() => '/'}
                subjectsTitle={t('breadcrumb.subjectsLinkText')}
                subject={subject}
                topicPath={topicPath}
                toTopic={toTopic}
              />
            ) : null}
          </section>
        </div>
      </OneColumn>
    </Hero>
  );
};

ArticleHero.propTypes = {
  article: PropTypes.shape({
    resourceTypes: PropTypes.arrayOf(ResourceTypeShape),
  }).isRequired,
  subject: SubjectShape,
  topicPath: PropTypes.arrayOf(TopicShape),
};
export default injectT(ArticleHero);
