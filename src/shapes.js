/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import PropTypes from 'prop-types';

export const ArticleShape = PropTypes.shape({
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  copyright: PropTypes.shape({
    creators: PropTypes.array.isRequired,
  }).isRequired,
  created: PropTypes.string.isRequired,
  updated: PropTypes.string.isRequired,
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

export const ResourceShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  contentUri: PropTypes.string,
  path: PropTypes.string.isRequired,
});

export const ResourceTypeShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  resources: PropTypes.arrayOf(ResourceShape),
});

export const LicenseShape = PropTypes.shape({
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
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
