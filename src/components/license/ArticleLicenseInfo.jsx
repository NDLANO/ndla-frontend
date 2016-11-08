/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes } from 'react';
import { injectT } from '../../i18n';

const ArticleLicenseInfo = ({ t, license, authors, created, updated }) => (
  <div>
    <h2>{license.heading}</h2>
    <p>{license.body}</p>
    <div className="license-section">
      <ul className="license__list">
        { t('license.creators', { num: authors.length })}
        {
          authors.map((author, i) => (<li className="license__list-item" key={i}>{author.name} {author.type ? `(${author.type})` : ''}</li>))
        }
      </ul>
    </div>
    <div className="license-section license__publication-info">
      {`${t('article.created')} ${created}. ${t('article.lastUpdated')} ${updated}`}
    </div>
  </div>
);

ArticleLicenseInfo.propTypes = {
  authors: PropTypes.array.isRequired,
  created: PropTypes.string.isRequired,
  updated: PropTypes.string.isRequired,
  license: PropTypes.shape({
    heading: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
  }),
};

export default injectT(ArticleLicenseInfo);
