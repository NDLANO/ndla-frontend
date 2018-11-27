/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';

import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { PageContainer } from '@ndla/ui';
import IntlProvider from '@ndla/i18n';
import Switch from 'react-router-dom/Switch';
import Route from 'react-router-dom/Route';
import withRouter from 'react-router-dom/withRouter';
import Router from 'react-router-dom/Router';
import createHistory from 'history/createBrowserHistory';
import { ApolloProvider } from 'react-apollo';
import { ArticleShape, ResourceTypeShape } from '../shapes';
import SearchContainer from '../containers/SearchPage/SearchContainer';
import { createApolloClient } from '../util/apiHelpers';
import { routes } from './routes';

if (process.env.NODE_ENV !== 'production') {
  // Can't require in production because of multiple asses emit to the same filename..
  require('../style/index.css'); // eslint-disable-line global-require
}


const LtiProvider = ({
  locale: { basename, abbreviation: locale, messages },
}) => {
  const browserHistory = basename ? createHistory({ basename }) : createHistory();
  const client = createApolloClient(locale);
  return (
    <ApolloProvider client={client}>
      <IntlProvider locale={locale} messages={messages}>
        <Router history={browserHistory}>
        <PageContainer>
          <Helmet htmlAttributes={{ lang: locale }} />
              <Switch>
                {routes.filter(route => route !== undefined).map(route => (
                  <Route
                    key={`route_${route.path}`}
                    exact={route.exact}
                    hideMasthead={route.hideMasthead}
                    initialProps={this.state.data}
                    locale={this.props.locale}
                    component={route.component}
                    background={route.background}
                    path={route.path}
                  />
                ))}
              </Switch>
        </PageContainer>
        </Router>
      </IntlProvider>
    </ApolloProvider>
  );
};

LtiProvider.propTypes = {
  locale: PropTypes.shape({
    abbreviation: PropTypes.string.isRequired,
    messages: PropTypes.object.isRequired,
  }).isRequired,
  resource: PropTypes.shape({
    article: ArticleShape,
    resourceTypes: PropTypes.arrayOf(ResourceTypeShape),
  }),
  status: PropTypes.oneOf(['success', 'error']),
};

export default LtiProvider;
