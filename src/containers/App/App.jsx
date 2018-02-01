/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import withRouter from 'react-router-dom/withRouter';
import Helmet from 'react-helmet';
import { PageContainer } from 'ndla-ui';
import { injectT } from 'ndla-i18n';

import { MessageShape } from '../../shapes';
import Footer from './components/Footer';
import { getLocale } from '../Locale/localeSelectors';
import { getMessages } from '../Messages/messagesSelectors';
import Alerts from '../Messages/Alerts';

export class App extends React.Component {
  getChildContext() {
    return {
      locale: this.props.locale,
    };
  }

  render() {
    const { dispatch, children, background, locale, messages, t } = this.props;
    return (
      <PageContainer background={background}>
        <Helmet
          htmlAttributes={{ lang: locale }}
          title="NDLA"
          meta={[{ name: 'description', content: t('meta.description') }]}
        />
        {children}
        <Footer t={t} />
        <Alerts dispatch={dispatch} messages={messages} />
      </PageContainer>
    );
  }
}

App.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string,
  }).isRequired,
  locale: PropTypes.string.isRequired,
  background: PropTypes.bool,
  messages: PropTypes.arrayOf(MessageShape).isRequired,
  dispatch: PropTypes.func.isRequired,
};

App.defaultProps = {
  background: true,
};

App.childContextTypes = {
  locale: PropTypes.string,
};

const mapStateToProps = state => ({
  locale: getLocale(state),
  messages: getMessages(state),
});

export default withRouter(connect(mapStateToProps)(injectT(App)));
