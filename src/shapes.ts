/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import PropTypes from 'prop-types';

export const LicenseShape = PropTypes.shape({
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
});

export const LicenseMetaInfoShape = PropTypes.shape({
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
});

export const CopyrightObjectShape = PropTypes.shape({
  license: PropTypes.shape({ license: PropTypes.string.isRequired }),
  authors: PropTypes.arrayOf(LicenseMetaInfoShape.isRequired),
  creators: PropTypes.arrayOf(LicenseMetaInfoShape.isRequired),
  processors: PropTypes.arrayOf(LicenseMetaInfoShape.isRequired),
  rightsholders: PropTypes.arrayOf(LicenseMetaInfoShape.isRequired),
});

export const ArticleShape = PropTypes.shape({
  title: PropTypes.string.isRequired,
  introduction: PropTypes.string,
  content: PropTypes.string.isRequired,
  copyright: PropTypes.shape({
    creators: PropTypes.array.isRequired,
    license: PropTypes.shape({
      license: PropTypes.string,
      url: PropTypes.string,
    }),
  }).isRequired,
  metaData: PropTypes.shape({
    footnotes: PropTypes.string,
  }),
  created: PropTypes.string.isRequired,
  updated: PropTypes.string.isRequired,
  published: PropTypes.string,
  supportedLanguages: PropTypes.arrayOf(PropTypes.string),
});

export const ArticleResultShape = PropTypes.shape({
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  ingress: PropTypes.string.isRequired,
  contentType: PropTypes.string.isRequired,
});

export const TaxonomyMetadataShape = PropTypes.shape({
  customFields: PropTypes.object,
});

export const SubjectShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  metadata: TaxonomyMetadataShape,
});

export const LearningpathStepShape = PropTypes.shape({
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
  resource: PropTypes.shape({
    article: ArticleShape,
    contentUri: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
    resourceTypes: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      }),
    ),
  }),
  license: PropTypes.shape({
    license: PropTypes.string,
    url: PropTypes.string,
    description: PropTypes.string,
  }),
  metaUrl: PropTypes.string,
  revision: PropTypes.number,
  status: PropTypes.string,
  supportedLanguages: PropTypes.arrayOf(PropTypes.string),
  type: PropTypes.string,
});

export const LearningpathShape = PropTypes.shape({
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
  learningsteps: PropTypes.arrayOf(LearningpathStepShape),
  metaUrl: PropTypes.string,
  revision: PropTypes.number,
  status: PropTypes.string,
  learningstepUrl: PropTypes.string,
  coverphoto: PropTypes.shape({
    url: PropTypes.string,
    metaUrl: PropTypes.string,
  }),
});

export const ResourceTypeShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
});

export const ResourceShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  contentUri: PropTypes.string,
  learningpath: LearningpathShape,
  path: PropTypes.string.isRequired,
  resourceTypes: PropTypes.arrayOf(ResourceTypeShape),
  relevanceId: PropTypes.string,
  rank: PropTypes.number,
  article: ArticleShape,
});

export const TopicShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  path: PropTypes.string,
  article: ArticleShape,
  coreResources: PropTypes.arrayOf(ResourceShape),
  supplementaryResources: PropTypes.arrayOf(ResourceShape),
  subtopics: PropTypes.array,
  metadata: TaxonomyMetadataShape,
});

export const MessageShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  severity: PropTypes.string,
  action: PropTypes.shape({
    title: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  }),
});

export const NewCopyrightObjectShape = PropTypes.shape({
  creators: PropTypes.arrayOf(LicenseMetaInfoShape.isRequired).isRequired,
  processors: PropTypes.arrayOf(LicenseMetaInfoShape.isRequired).isRequired,
  rightsholders: PropTypes.arrayOf(LicenseMetaInfoShape.isRequired).isRequired,
});

export const FootNoteShape = PropTypes.shape({
  title: PropTypes.string.isRequired,
  year: PropTypes.string.isRequired,
  authors: PropTypes.array.isRequired,
  edition: PropTypes.string.isRequired,
  publisher: PropTypes.string.isRequired,
});

export const FilterShape = PropTypes.shape({
  title: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  subjectId: PropTypes.string.isRequired,
});

export const LtiDataShape = PropTypes.shape({
  launch_presentation_return_url: PropTypes.string,
  launch_presentation_document_target: PropTypes.string,
  launch_presentation_width: PropTypes.string,
  launch_presentation_height: PropTypes.string,
  ext_content_return_types: PropTypes.string,
});

export const ImageShape = PropTypes.shape({
  title: PropTypes.string,
  src: PropTypes.string.isRequired,
  altText: PropTypes.string,
  copyright: CopyrightObjectShape,
});

export const MetaImageShape = PropTypes.shape({
  url: PropTypes.string,
  alt: PropTypes.string,
});

export const H5pShape = PropTypes.shape({
  title: PropTypes.string,
  src: PropTypes.string.isRequired,
  copyright: CopyrightObjectShape,
});

export const BreadCrumbShape = PropTypes.shape({
  name: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
});

export const SearchParamsShape = PropTypes.shape({
  contextFilters: PropTypes.arrayOf(PropTypes.string),
  languageFilter: PropTypes.arrayOf(PropTypes.string),
  page: PropTypes.string,
  resourceTypes: PropTypes.arrayOf(PropTypes.string),
  subjects: PropTypes.arrayOf(PropTypes.string),
});

export const SearchItemShape = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  ingress: PropTypes.string,
  breadcrumb: PropTypes.arrayOf(PropTypes.string),
  img: MetaImageShape,
});

export const SearchDataShape = PropTypes.shape({
  resources: PropTypes.arrayOf(PropTypes.object).isRequired,
  totalCount: PropTypes.number.isRequired,
  language: PropTypes.string,
  resourceType: PropTypes.string,
  type: PropTypes.string,
  suggestions: PropTypes.arrayOf(PropTypes.object),
});

export const SearchGroupShape = PropTypes.shape({
  type: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(SearchItemShape).isRequired,
  totalCount: PropTypes.number.isRequired,
  loading: PropTypes.bool,
});

export const TypeFilterShape = PropTypes.shape({
  filters: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      active: PropTypes.bool,
    }),
  ),
  page: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
});

export const ConceptShape = PropTypes.shape({
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  image: PropTypes.shape({
    url: PropTypes.string,
    alt: PropTypes.string,
  }),
});

export const ConceptLicenseShape = PropTypes.shape({
  copyright: CopyrightObjectShape,
  src: PropTypes.string.isRequired,
  title: PropTypes.string,
});

export const SubjectCategoryShape = PropTypes.shape({
  name: PropTypes.string.isRequired,
  subjects: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }),
  ),
});

export const ProgrammeShape = PropTypes.shape({
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
});

export const HistoryShape = PropTypes.shape({
  push: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
  block: PropTypes.func.isRequired,
  replace: PropTypes.func.isRequired,
});

export const LocationShape = PropTypes.shape({
  search: PropTypes.string.isRequired,
  pathname: PropTypes.string.isRequired,
  hash: PropTypes.string.isRequired,
  state: PropTypes.any,
  key: PropTypes.string,
}).isRequired;

export const RoutePropTypes = {
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
    params: PropTypes.object.isRequired,
    isExact: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,
  }).isRequired,
  location: LocationShape,
  history: HistoryShape.isRequired,
};
