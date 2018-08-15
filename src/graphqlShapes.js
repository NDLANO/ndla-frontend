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
    id: PropTypes.number,
    introduction: PropTypes.string,
    lastUpdated: PropTypes.string,
    metaDescription: PropTypes.string,
    metaImage: PropTypes.shape({
      url: PropTypes.string,
      alt: PropTypes.string,
      language: PropTypes.string,
    }),
    title: PropTypes.string,
  }),
});

export const GraphQLSubjectPageResourcesShape = PropTypes.shape({
  location: PropTypes.string,
  resources: PropTypes.arrayOf(GraphQLResourceShape),
});

export const GraphQLSubjectPageTopicalShape = PropTypes.shape({
  resource: GraphQLResourceShape,
});

export const GraphqlResourceTypeShape = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
  subtypes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    }),
  ),
});

export const GraphQLSubjectPageAboutShape = PropTypes.shape({
  title: PropTypes.string,
  description: PropTypes.string,
  visualElement: PropTypes.shape({
    type: PropTypes.string,
    url: PropTypes.string,
    alt: PropTypes.string,
  }),
});

export const GraphQLSubjectPageShape = PropTypes.shape({
  id: PropTypes.number,
  subjectListLocation: PropTypes.string,
  resources: PropTypes.arrayOf(GraphQLResourceShape),
  editorsChoices: GraphQLSubjectPageResourcesShape,
  latestContent: GraphQLSubjectPageResourcesShape,
  mostRead: GraphQLSubjectPageResourcesShape,
  topical: GraphQLSubjectPageTopicalShape,
  banner: PropTypes.shape({
    desktopUrl: PropTypes.string,
    desktopId: PropTypes.string,
    mobileUrl: PropTypes.string,
    mobileId: PropTypes.string,
  }),
  facebook: PropTypes.string,
  twitter: PropTypes.string,
  displayInTwoColumns: PropTypes.bool,
  about: GraphQLSubjectPageAboutShape,
  goTo: PropTypes.shape({
    resourceTypes: PropTypes.arrayOf(GraphqlResourceTypeShape),
  }),
});

export const GraphQLSubjectShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  topics: PropTypes.arrayOf(GraphQLTopicShape),
  filters: PropTypes.arrayOf(GraphQLFilterShape),
  subjectpage: GraphQLSubjectPageShape,
});

export const GraphqlResourceTypeWithsubtypesShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  subtypes: PropTypes.arrayOf(PropTypes.object),
});

export const GraphqlErrorShape = PropTypes.shape({
  message: PropTypes.string.isRequired,
  path: PropTypes.arrayOf(PropTypes.string),
  status: PropTypes.number,
  json: PropTypes.object,
});

export const GraphQLSimpleSubjectShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
});

export const GraphQLFrontpageCategoryShape = PropTypes.shape({
  name: PropTypes.string,
  subjects: PropTypes.arrayOf(GraphQLSimpleSubjectShape),
});

export const GraphQLFrontpageShape = PropTypes.shape({
  topical: PropTypes.arrayOf(PropTypes.object),
  categories: PropTypes.arrayOf(GraphQLFrontpageCategoryShape),
});
