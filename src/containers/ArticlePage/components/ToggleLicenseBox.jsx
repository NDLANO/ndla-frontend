/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import { Button } from 'ndla-ui';

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
    const { openTitle, closeTitle, children, licenseBox } = this.props;
    const { expanded } = this.state;

    return (
      <div className={classnames('license c-licensebox', { 'c-licensebox--expanded': expanded })}>
        <Button stripped className="license-toggler" onClick={this.toogleLicenseBox} >
          {expanded ? closeTitle : openTitle}
        </Button>
        {children}
        { expanded ? licenseBox : null }
      </div>
    );
  }
}

ToggleLicenseBox.propTypes = {
  openTitle: PropTypes.string.isRequired,
  closeTitle: PropTypes.string.isRequired,
  children: PropTypes.node,
  licenseBox: PropTypes.node.isRequired,
};

export default ToggleLicenseBox;
