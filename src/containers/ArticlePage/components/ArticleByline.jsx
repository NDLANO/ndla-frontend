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
import { Time, User } from 'ndla-ui/icons';

const classes = new BEMHelper({
  name: 'article-byline',
  prefix: 'c-',
});

const ArticleByline = ({ authors, updated, children }) => (
  <div>
    <section {...classes()}>
      <span {...classes('flex')}>
        <span {...classes('icon')}>
          <User />
        </span>
        <span {...classes('authors')}>
          Skrevet av {authors && authors.map(author => author.name).join(', ')}
        </span>
      </span>
      <span {...classes('flex')}>
        <span {...classes('icon')}>
          <Time />
        </span>
        <span {...classes('date')}>Sist oppdatert {updated}</span>
        {children}
      </span>
    </section>
  </div>
);

ArticleByline.propTypes = {
  authors: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  updated: PropTypes.string.isRequired,
};

export default ArticleByline;
