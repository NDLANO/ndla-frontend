/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { uuid } from 'ndla-util';
import BEMHelper from 'react-bem-helper';

const cClasses = new BEMHelper({
  name: 'medialist',
  prefix: 'c-',
});

export const MediaListItemMeta = ({ authors }) => (
  <ul {...cClasses('actions')}>
    {authors.map(author => (
      <li key={uuid()} className="c-medialist__meta-item">
        {author.type}: {author.name}
      </li>
    ))}
  </ul>
);

MediaListItemMeta.propTypes = {
  authors: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ),
};
