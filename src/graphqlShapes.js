/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import PropTypes from 'prop-types';

export const GraphQLTopicShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  parent: PropTypes.string,
  meta: PropTypes.shape({
    metaDescription: PropTypes.string,
  }),
});

export const GraphQLFilterShape = PropTypes.shape({
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
});

export const GraphQLSubjectShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  topics: PropTypes.arrayOf(GraphQLTopicShape),
  filters: PropTypes.arrayOf(GraphQLFilterShape),
});

export const GraphQLResourceTypeShape = PropTypes.shape({
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
});

export const GraphQLResourceShape = PropTypes.shape({
  contentUri: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  resourceTypes: PropTypes.arrayOf(GraphQLResourceTypeShape),
  meta: PropTypes.shape({
    id: PropTypes.number.isRequired,
    introduction: PropTypes.string.isRequired,
    lastUpdated: PropTypes.string.isRequired,
    metaDescription: PropTypes.string.isRequired,
    metaImage: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }),
});

export const GraphQLSubjectPageShape = PropTypes.shape({
  location: PropTypes.string.isRequired,
  resources: PropTypes.arrayOf(GraphQLResourceShape),
});

export const GraphqlResourceTypeWithsubtypesShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  subtypes: PropTypes.arrayOf(PropTypes.shape(GraphQLResourceTypeShape)),
});

export const GraphqlErrorShape = PropTypes.shape({
  message: PropTypes.string.isRequired,
  path: PropTypes.arrayOf(PropTypes.string),
  status: PropTypes.number,
  json: PropTypes.object,
});
