/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Switch from 'react-router-dom/Switch';
import ReactRoute from 'react-router-dom/Route';
import matchPath from 'react-router-dom/matchPath';
import withRouter from 'react-router-dom/withRouter';
import { Content } from 'ndla-ui';
import { withApollo } from 'react-apollo';
import Page from './containers/Page/Page';
import Masthead from './containers/Masthead';
import { routes } from './routes';
import handleError from './util/handleError';
import ZendeskButton from './components/ZendeskButton';

const Route = ({
  component: Component,
  initialProps,
  locale,
  background,
  ...rest
}) => (
  <ReactRoute
    {...rest}
    render={props => (
      <Page background={background}>
        <Content>
          <Masthead {...props} />
          <Component {...props} locale={locale} {...initialProps} />
        </Content>
        <ZendeskButton />
      </Page>
    )}
  />
);

Route.propTypes = {
  component: PropTypes.func.isRequired,
  background: PropTypes.bool.isRequired,
  locale: PropTypes.string.isRequired,
  initialProps: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

async function loadInitialProps(pathname, ctx) {
  const promises = [];
  routes.some(route => {
    const match = matchPath(pathname, route);
    if (match && route.component.getInitialProps) {
      promises.push(route.component.getInitialProps({ match, ...ctx }));
    }
    return !!match;
  });
  return Promise.all(promises);
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.location = null;
    this.state = { data: props.initialProps, location: null };
    this.handleLoadInitialProps = this.handleLoadInitialProps.bind(this);
  }

  componentDidMount() {
    if (
      window.DATA.config.disableSSR ||
      (module.hot && module.hot.status() === 'apply')
    ) {
      this.handleLoadInitialProps(this.props);
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.location === null) {
      return {
        location: nextProps.location,
      };
    }
    const navigated = nextProps.location !== prevState.location;
    if (navigated) {
      return {
        data: { loading: true },
        location: nextProps.location,
      };
    }

    // No state update necessary
    return null;
  }

  componentDidUpdate() {
    if (this.state.data.loading === true) {
      this.handleLoadInitialProps(this.props);
    }
  }

  componentWillUnmount() {
    this.location = null;
  }

  async handleLoadInitialProps(props) {
    if (props.location === this.location) {
      // Data for this location is already loading
      return;
    }

    this.location = props.location;
    try {
      const data = await loadInitialProps(props.location.pathname, {
        locale: props.locale,
        location: props.location,
        history: props.history,
        client: props.client,
      });

      // Only update state if on the same route
      if (props.location === this.location) {
        this.setState({ data: data[0] });
      }
    } catch (e) {
      handleError(e);
    }
  }

  render() {
    return (
      <Switch>
        {routes
          .filter(route => route !== undefined)
          .map(route => (
            <Route
              key={`route_${route.path}`}
              exact={route.exact}
              initialProps={this.state.data}
              locale={this.props.locale}
              component={route.component}
              background={route.background}
              path={route.path}
            />
          ))}
      </Switch>
    );
  }
}

App.propTypes = {
  locale: PropTypes.string.isRequired,
  location: PropTypes.shape({ pathname: PropTypes.string.isRequired }),
  initialProps: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default withRouter(withApollo(App));
