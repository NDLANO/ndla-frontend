/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Component } from 'react';
import { ButtonV2 } from '@ndla/button';
import { copyTextToClipboard } from '@ndla/util';

interface Props {
  stringToCopy?: string;
  copyTitle: string;
  hasCopiedTitle: string;
}

interface State {
  hasCopied: boolean;
}
class CopyTextButton extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasCopied: false };
    this.handleClick = this.handleClick.bind(this);
  }

  timeout: ReturnType<typeof setTimeout> | undefined;
  buttonContainer: HTMLSpanElement | null = null;

  componentWillUnmount() {
    window.clearTimeout(this.timeout!);
  }

  handleClick() {
    const { stringToCopy } = this.props;
    const success = copyTextToClipboard(
      stringToCopy ?? '',
      this.buttonContainer!,
    );

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
        ref={(r) => {
          this.buttonContainer = r;
        }}
      >
        <ButtonV2
          variant="outline"
          className="c-licenseToggle__button"
          disabled={hasCopied}
          onClick={this.handleClick}
        >
          {hasCopied ? hasCopiedTitle : copyTitle}
        </ButtonV2>
      </span>
    );
  }
}

export default CopyTextButton;
