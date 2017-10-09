/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import getResourceTypeMetaData from '../../../components/getResourceTypeMetaData';
import { ResourceTypeShape } from '../../../shapes';

const classes = new BEMHelper({
  name: 'article',
  prefix: 'c-',
});

const ArticleTitle = ({ resourceTypes, title }) => {
  if (resourceTypes && resourceTypes.length > 0) {
    const resourceTypeMetaData = getResourceTypeMetaData(resourceTypes);
    return (
      <h1 {...classes('title', 'icon')}>
        {resourceTypeMetaData.icon}
        {title}
      </h1>
    );
  }

  return <h1 {...classes('title')}>{title}</h1>;
};

ArticleTitle.propTypes = {
  title: PropTypes.string.isRequired,
  resourceTypes: PropTypes.arrayOf(ResourceTypeShape),
};

export default ArticleTitle;
