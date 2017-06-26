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
import { LicenseAuthorShape } from '../../shapes';

class CopyTextButton extends Component {
  constructor(props) {
    super(props);
    this.state = { hasCopied: false };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const authorsCopyString = this.props.authors
      .map(author => `${author.type}: ${author.name}`)
      .join('\n');

    const success = copyTextToClipboard(authorsCopyString);

    if (success) {
      this.setState({ hasCopied: true });

      setTimeout(() => {
        // Reset state after 10 seconds
        this.setState({ hasCopied: false });
      }, 10000);
    }
  }

  render() {
    const { hasCopied } = this.state;
    const { copyTitle, hasCopiedTitle } = this.props;
    return (
      <Button
        outline
        className="c-licenseToggle__button"
        disabled={hasCopied}
        onClick={this.handleClick}>
        {hasCopied ? hasCopiedTitle : copyTitle}
      </Button>
    );
  }
}

CopyTextButton.propTypes = {
  authors: PropTypes.arrayOf(LicenseAuthorShape),
  copyTitle: PropTypes.string.isRequired,
  hasCopiedTitle: PropTypes.string.isRequired,
};

export default CopyTextButton;
