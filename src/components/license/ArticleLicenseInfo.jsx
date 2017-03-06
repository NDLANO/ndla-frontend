/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes } from 'react';
import { uuid } from 'ndla-util';
import { ArticleShape } from '../../shapes';
import { injectT } from '../../i18n';
import LicenseByline from './LicenseByline';

const ArticleLicenseInfo = ({ t, license, article }) => (
  <div>
    <div>
      <div>
        <LicenseByline license={license} />
        <h3 className="license__heading">{license.title}</h3>
        <p>{license.description}</p>
      </div>
      <div className="license__publication-info c-bodybox">
        <ul className="license__list">
          <li className="license__list-item"><h4>Tittel:</h4> {article.title}<br /></li>
          <li className="license__list-item"><h4>{t('article.created')}:</h4> {`${article.created}. (${t('article.lastUpdated')} ${article.updated}`})</li>
        </ul>
        <ul className="license__list">
          <h4>{ t('license.creators', { num: article.copyright.authors.length })}</h4>
          {
            article.copyright.authors.map(author => (<li className="license__list-item" key={uuid()}>{author.name} {author.type ? `(${author.type})` : ''}</li>))
          }
        </ul>
      </div>
    </div>
  </div>
);

ArticleLicenseInfo.propTypes = {
  article: ArticleShape.isRequired,
  license: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }),
  icons: PropTypes.object.isRequired,
};

export default injectT(ArticleLicenseInfo);
