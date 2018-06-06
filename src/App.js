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
  hideMasthead,
  ...rest
}) => (
  <ReactRoute
    {...rest}
    render={props => (
      <Page background={background}>
        <Content>
          {!hideMasthead && <Masthead {...props} />}
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
  initialProps: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  hideMasthead: PropTypes.bool,
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
    this.state = { data: props.initialProps };
    this.handleLoadInitialProps = this.handleLoadInitialProps.bind(this);
  }

  componentWillMount() {
    this.isUnmounted = false;
  }

  componentDidMount() {
    this.isUnmounted = false;
    if (
      window.DATA.config.disableSSR ||
      (module.hot && module.hot.status() === 'apply')
    ) {
      this.handleLoadInitialProps(this.props);
    }
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    this.isUnmounted = false;
    const navigated = nextProps.location !== this.props.location;
    if (navigated) {
      window.scrollTo(0, 0);
      this.handleLoadInitialProps(nextProps);
    }
  }

  async handleLoadInitialProps(props) {
    try {
      this.setState(prevState => ({
        data: { ...prevState.data, loading: true },
      }));
      const data = await loadInitialProps(props.location.pathname, {
        locale: props.locale,
        location: props.location,
        history: props.history,
        client: props.client,
      });
      if (!this.isUnmounted) {
        this.setState(prevState => ({
          data: { ...prevState.data, ...data[0], loading: false },
        }));
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
              hideMasthead={route.hideMasthead}
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
