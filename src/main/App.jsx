/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { getLocale } from '../locale/localeSelectors';
import { getMessages } from '../messages/messagesSelectors';
import Alerts from '../messages/Alerts';
import { Wrapper, Footer } from '../common/Layout';

export class App extends React.Component {
  getChildContext() {
    return {
      lang: this.props.locale,
    };
  }

  render() {
    const { dispatch, children, messages } = this.props;
    return (
      <Wrapper className="page-container">
        {children}
        <Footer />
        <Alerts dispatch={dispatch} messages={messages} />
      </Wrapper>
    );
  }
}

App.propTypes = {
  locale: PropTypes.string.isRequired,
  messages: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired,
};

App.childContextTypes = {
  lang: PropTypes.string,
};

const mapStateToProps = (state) => ({
  locale: getLocale(state),
  messages: getMessages(state),
});

export default connect(mapStateToProps)(App);
