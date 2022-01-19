/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import PropTypes from 'prop-types';
import { ArticleShape, LicenseShape } from '@ndla/ui/lib/shapes';
import { CopyrightObjectShape } from './shapes';

export const GraphqlTaxonomyMetadataShape = PropTypes.shape({
  customFields: PropTypes.object,
});

export const GraphQLTopicShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  parent: PropTypes.string,
  meta: PropTypes.shape({
    metaDescription: PropTypes.string,
  }),
  metadata: GraphqlTaxonomyMetadataShape,
});

export const GraphQLResourceTypeShape = PropTypes.shape({
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
});

export const GraphQLLearningpathStepShape = PropTypes.shape({
  id: PropTypes.number,
  title: PropTypes.string,
  seqNo: PropTypes.number,
  description: PropTypes.string,
  embedUrl: PropTypes.shape({
    embedType: PropTypes.string,
    url: PropTypes.string,
  }),
  oembed: PropTypes.shape({
    type: PropTypes.string,
    version: PropTypes.string,
    height: PropTypes.number,
    html: PropTypes.string,
    width: PropTypes.number,
  }),
  license: LicenseShape,
  metaUrl: PropTypes.string,
  revision: PropTypes.number,
  status: PropTypes.string,
  supportedLanguages: PropTypes.arrayOf(PropTypes.string),
  type: PropTypes.string,
  article: ArticleShape,
});

export const GraphQLLearningpathShape = PropTypes.shape({
  id: PropTypes.number,
  title: PropTypes.string,
  description: PropTypes.string,
  copyright: CopyrightObjectShape,
  duration: PropTypes.number,
  canEdit: PropTypes.bool,
  verificationStatus: PropTypes.string,
  lastUpdated: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
  isBasedOn: PropTypes.number,
  learningsteps: PropTypes.arrayOf(GraphQLLearningpathStepShape),
  metaUrl: PropTypes.string,
  revision: PropTypes.number,
  status: PropTypes.string,
  learningstepUrl: PropTypes.string,
  coverphoto: PropTypes.shape({
    url: PropTypes.string,
    metaUrl: PropTypes.string,
  }),
});

export const GraphQLResourceShape = PropTypes.shape({
  contentUri: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  path: PropTypes.string,
  resourceTypes: PropTypes.arrayOf(GraphQLResourceTypeShape),
  learningpath: GraphQLLearningpathShape,
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
  editorsChoices: PropTypes.arrayOf(GraphQLResourceShape),
  latestContent: PropTypes.arrayOf(GraphQLResourceShape),
  mostRead: PropTypes.arrayOf(GraphQLResourceShape),
  topical: GraphQLResourceShape,
  banner: PropTypes.shape({
    desktopUrl: PropTypes.string,
    desktopId: PropTypes.string,
    mobileUrl: PropTypes.string,
    mobileId: PropTypes.string,
  }),
  facebook: PropTypes.string,
  twitter: PropTypes.string,
  layout: PropTypes.string,
  metaDescription: PropTypes.string,
  about: GraphQLSubjectPageAboutShape,
  goTo: PropTypes.arrayOf(GraphqlResourceTypeShape),
});

export const GraphQLSubjectShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  topics: PropTypes.arrayOf(GraphQLTopicShape),
  subjectpage: GraphQLSubjectPageShape,
});

export const GraphQLArticleMetaShape = PropTypes.shape({
  id: PropTypes.string,
  title: PropTypes.string,
  metaDescription: PropTypes.string,
  metaImage: PropTypes.shape({
    url: PropTypes.string,
    alt: PropTypes.string,
    language: PropTypes.string,
  }),
});

export const GraphQLMovieThemeShape = PropTypes.shape({
  id: PropTypes.number,
  name: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string }))
    .isRequired,
  movies: PropTypes.arrayOf(GraphQLArticleMetaShape),
});

export const GraphQLFilmFrontpageShape = PropTypes.shape({
  name: PropTypes.string.isRequired,
  about: GraphQLSubjectPageAboutShape,
  movieThemes: PropTypes.arrayOf(GraphQLMovieThemeShape),
  slideShow: PropTypes.arrayOf(GraphQLArticleMetaShape),
});

export const GraphqlResourceTypeWithsubtypesShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  subtypes: PropTypes.arrayOf(PropTypes.object),
});

export const GraphqlErrorShape = PropTypes.shape({
  message: PropTypes.string.isRequired,
  path: PropTypes.arrayOf(
    PropTypes.oneOf([PropTypes.string, PropTypes.number]),
  ),
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
