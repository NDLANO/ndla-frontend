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
  content: PropTypes.string.isRequired,
  copyright: PropTypes.shape({
    creators: PropTypes.array.isRequired,
  }).isRequired,
  created: PropTypes.string.isRequired,
  updated: PropTypes.string.isRequired,
  supportedLanguages: PropTypes.arrayOf(PropTypes.string),
});

export const ArticleResultShape = PropTypes.shape({
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  ingress: PropTypes.string.isRequired,
  contentType: PropTypes.string.isRequired,
});

export const SubjectShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
});

export const TopicShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  subtopics: PropTypes.array,
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
  license: LicenseShape,
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

export const ResourceShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  contentUri: PropTypes.string,
  learningpath: LearningpathShape,
  path: PropTypes.string.isRequired,
});

export const ResourceTypeShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  resources: PropTypes.arrayOf(ResourceShape),
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

export const LocationShape = PropTypes.shape({
  search: PropTypes.string,
  pathname: PropTypes.string.isRequired,
}).isRequired;

export const LtiDataShape = PropTypes.shape({
  launch_presentation_return_url: PropTypes.string,
  launch_presentation_document_target: PropTypes.string,
  launch_presentation_width: PropTypes.string,
  launch_presentation_height: PropTypes.string,
  ext_content_return_types: PropTypes.string,
});

export const SearchParamsShape = PropTypes.shape({
  contextFilters: PropTypes.arrayOf(PropTypes.string),
  languageFilter: PropTypes.arrayOf(PropTypes.string),
  levels: PropTypes.arrayOf(PropTypes.string),
  page: PropTypes.string,
  resourceTypes: PropTypes.arrayOf(PropTypes.string),
  subjects: PropTypes.arrayOf(PropTypes.string),
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
