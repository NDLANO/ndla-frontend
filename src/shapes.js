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
    authors: PropTypes.array.isRequired,
  }).isRequired,
  created: PropTypes.string.isRequired,
  updated: PropTypes.string.isRequired,
});

export const ArticleResultShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      language: PropTypes.string.isRequired,
    }),
  ).isRequired,
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
  title: PropTypes.string,
  introduction: PropTypes.string,
  coverPhotoUrl: PropTypes.string,
  contentUri: PropTypes.string,
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

export const CopyrightObjectShape = PropTypes.shape({
  title: PropTypes.string,
  src: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  copyright: PropTypes.shape({
    authors: PropTypes.array.isRequired,
  }).isRequired,
});
