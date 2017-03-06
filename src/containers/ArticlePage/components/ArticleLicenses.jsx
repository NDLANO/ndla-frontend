/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 * FRI OG BEGRENSET
 */

import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import { LicenseByline } from 'ndla-ui';
import { ArticleShape, LicenseShape } from '../../../shapes';

class ArticleLicenses extends Component {
  constructor() {
    super();
    this.toogleLicenseBox = this.toogleLicenseBox.bind(this);
    this.state = {
      expanded: false,
    };
  }

  toogleLicenseBox() {
    this.setState({
      expanded: !this.state.expanded,
    });
  }

  render() {
    const { article, openTitle, closeTitle, children, license, showByline } = this.props;
    const authorsList = article.copyright.authors.map(author => author.name).join(', ');
    const { expanded } = this.state;

    return (
      <div className={classnames('c-licensebox license', { 'u-expanded': expanded })}>
        <button className="un-button license-toggler site-nav_link" onClick={this.toogleLicenseBox} >
          {expanded ? closeTitle : openTitle}
        </button>

        {showByline ?
          <LicenseByline license={license}>
            <span className="article_meta">{authorsList}. Publisert: {article.created}</span>.
          </LicenseByline>
          :
          null
        }

        { expanded ? children : null }
      </div>
    );
  }
}

ArticleLicenses.defaultProps = {
  showByline: false,
};

ArticleLicenses.propTypes = {
  article: ArticleShape.isRequired,
  license: LicenseShape.isRequired,
  openTitle: PropTypes.string.isRequired,
  closeTitle: PropTypes.string.isRequired,
  showByline: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export default ArticleLicenses;
