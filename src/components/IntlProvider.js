/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Component, Children } from 'react';
import PropTypes from 'prop-types';
import IntlMessageFormat from 'intl-messageformat';
import memoizeIntlConstructor from 'intl-format-cache';
import localFormatMessage from '../util/formatMessage';

export default class IntlProvider extends Component {
  constructor(props, context = {}) {
    super(props, context);

    const { getMessageFormat } = context;

    this.state = {
      getMessageFormat:
        getMessageFormat || memoizeIntlConstructor(IntlMessageFormat),
    };
  }

  getChildContext() {
    const { getMessageFormat } = this.state;
    const { locale, messages } = this.props;
    const formatMessage = localFormatMessage.bind(
      null,
      locale,
      messages,
      getMessageFormat,
    );

    return {
      getMessageFormat,
      formatMessage,
    };
  }

  render() {
    return Children.only(this.props.children);
  }
}

IntlProvider.propTypes = {
  locale: PropTypes.string.isRequired,
  messages: PropTypes.object.isRequired, //eslint-disable-line
};

IntlProvider.contextTypes = {
  getMessageFormat: PropTypes.func,
  formatMessage: PropTypes.func,
};

IntlProvider.childContextTypes = {
  getMessageFormat: PropTypes.func.isRequired,
  formatMessage: PropTypes.func.isRequired,
};
