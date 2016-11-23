/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes } from 'react';
import { injectT } from '../../i18n';

const ArticleLicenseInfo = ({ t, license, authors, title, created, updated, icons }) => (
  <div>
    <div>
      <div className="license__publication-info">
        <ul className="license__list">
          <li className="license__list-item">Tittel: {title}<br /></li>
          <li className="license__list-item">{`${t('article.created')} ${created}. ${t('article.lastUpdated')} ${updated}`}</li>
        </ul>
      </div>
      <ul className="license__list">
        { t('license.creators', { num: authors.length })}
        {
          authors.map((author, i) => (<li className="license__list-item" key={i}>{author.name} {author.type ? `(${author.type})` : ''}</li>))
        }
      </ul>
    </div>
    {icons}
    <h3>{license.title}</h3>
    <p>{license.description}</p>

  </div>
);

ArticleLicenseInfo.propTypes = {
  authors: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  created: PropTypes.string.isRequired,
  updated: PropTypes.string.isRequired,
  license: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }),
  icons: PropTypes.object.isRequired,
};

export default injectT(ArticleLicenseInfo);
