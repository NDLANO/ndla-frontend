/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FrontpageHighlighted, ContentCard } from 'ndla-ui';
import { breakpoints } from 'ndla-util';
import { injectT } from 'ndla-i18n';
import config from '../../config';

const getMetaInformation = meta => {
  if (!meta) {
    return {
      image: '',
      text: '',
    };
  }
  return {
    text: meta.metaDescription,
    image: meta.metaImage ? meta.metaImage.url : '',
  };
};

const getResourceType = resourceTypes => {
  if (!resourceTypes || resourceTypes.length === 0) {
    return '';
  }
  return resourceTypes[0].name;
};

const FrontpageHighlights = ({ topical, t }) => {
  if (config.showAllFrontpageSubjects) {
    return null;
  }

  const contentCards = topical
    ? topical.map(resource => ({
        id: resource.id,
        title: resource.name,
        isFilm: false,
        type: getResourceType(resource.resourceTypes),
        url: resource.path,
        ...getMetaInformation(resource.meta),
      }))
    : [];

  return (
    <FrontpageHighlighted heading={t('welcomePage.highlighted')}>
      {contentCards.map(card => (
        <div key={`slide-${card.id}`}>
          <ContentCard
            url={card.url}
            heading={card.title}
            description={card.text}
            isFilm={card.isFilm}
            type={card.type}
            images={[
              {
                url: card.image,
                types: Object.keys(breakpoints),
              },
            ]}
          />
        </div>
      ))}
    </FrontpageHighlighted>
  );
};

FrontpageHighlights.propTypes = {
  expanded: PropTypes.string,
  topical: PropTypes.arrayOf(PropTypes.object),
};

export default injectT(FrontpageHighlights);
