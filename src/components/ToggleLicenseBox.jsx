/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Button } from 'ndla-ui';
import LicenseBox from './license/LicenseBox';
import { ArticleShape } from '../shapes';

class ToggleLicenseBox extends Component {
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
    const { openTitle, closeTitle, article, locale } = this.props;
    const { expanded } = this.state;

    return (
      <div
        className={classnames('license c-licensebox', {
          'c-licensebox--expanded': expanded,
        })}>
        <Button
          stripped
          className="c-article__license-toggler"
          onClick={this.toogleLicenseBox}>
          {expanded ? closeTitle : openTitle}
        </Button>
        {expanded ? <LicenseBox article={article} locale={locale} /> : null}
      </div>
    );
  }
}

ToggleLicenseBox.propTypes = {
  openTitle: PropTypes.string.isRequired,
  closeTitle: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  article: ArticleShape.isRequired,
};

export default ToggleLicenseBox;
