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
import { CopyrightObjectShape } from '../../shapes';

class CopyTextButton extends Component {
  constructor(props) {
    super(props);
    this.state = { hasCopied: false };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const { copyright, t } = this.props;
    const license = copyright.license.license;
    let creatorsCopyString;

    if (copyright.authors) {
      creatorsCopyString = copyright.authors
        .map(author => `${author.type}: ${author.name}`)
        .join('\n');
    } else {
      creatorsCopyString = copyright.creators
        .map(creator => {
          const type = t(`creditType.${creator.type.toLowerCase()}`);
          return `${type}: ${creator.name}`;
        })
        .join('\n');
    }

    const licenseCopyString = `${license.toLowerCase().includes('by')
      ? 'CC '
      : ''}${license}`.toUpperCase();

    const copyString = `${licenseCopyString} ${creatorsCopyString}`;
    const success = copyTextToClipboard(copyString);

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
  copyright: CopyrightObjectShape.isRequired,
  copyTitle: PropTypes.string.isRequired,
  hasCopiedTitle: PropTypes.string.isRequired,
};

export default CopyTextButton;
