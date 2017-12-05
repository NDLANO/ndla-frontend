/*
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { copyTextToClipboard } from 'ndla-util';
import { Button } from 'ndla-ui';

class CopyTextButton extends Component {
  constructor(props) {
    super(props);
    this.state = { hasCopied: false };
    this.handleClick = this.handleClick.bind(this);
  }

  componentWillUnmount() {
    window.clearTimeout(this.timeout);
  }

  handleClick() {
    const { stringToCopy } = this.props;
    const success = copyTextToClipboard(stringToCopy, this.buttonContainer);

    if (success) {
      this.setState({ hasCopied: true });

      this.timeout = setTimeout(() => {
        // Reset state after 10 seconds
        this.setState({ hasCopied: false });
      }, 10000);
    }
  }

  render() {
    const { hasCopied } = this.state;
    const { copyTitle, hasCopiedTitle } = this.props;
    return (
      <span
        ref={r => {
          this.buttonContainer = r;
        }}>
        <Button
          outline
          className="c-licenseToggle__button"
          disabled={hasCopied}
          onClick={this.handleClick}>
          {hasCopied ? hasCopiedTitle : copyTitle}
        </Button>
      </span>
    );
  }
}

CopyTextButton.propTypes = {
  stringToCopy: PropTypes.string.isRequired,
  copyTitle: PropTypes.string.isRequired,
  hasCopiedTitle: PropTypes.string.isRequired,
};

export default CopyTextButton;
