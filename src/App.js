/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import {
  Route as ReactRoute,
  matchPath,
  withRouter,
  Switch,
} from 'react-router-dom';
import { Content } from '@ndla/ui';
import Page from './containers/Page/Page';
import Masthead from './containers/Masthead';
import { routes } from './routes';
import handleError from './util/handleError';
import ErrorPage from './containers/ErrorPage/ErrorPage';
import { FILM_PAGE_PATH, SKIP_TO_CONTENT_ID, SUBJECT_PAGE_PATH } from './constants';

export const BasenameContext = React.createContext('');

const Route = ({
  component: Component,
  initialProps,
  locale,
  background,
  hideMasthead,
  ndlaFilm,
  skipToContent,
  location,
  ...rest
}) => (
  <ReactRoute
    {...rest}
    render={props => (
      <Page
        background={background}
        locale={locale}
        ndlaFilm={ndlaFilm}
        location={location}>
        <Content>
          {!hideMasthead && (
            <Masthead
              skipToMainContentId={SKIP_TO_CONTENT_ID}
              locale={locale}
              ndlaFilm={ndlaFilm}
              {...props}
            />
          )}
          <Component
            {...props}
            locale={locale}
            ndlaFilm={ndlaFilm}
            skipToContentId={SKIP_TO_CONTENT_ID}
            {...initialProps}
          />
        </Content>
      </Page>
    )}
  />
);

Route.propTypes = {
  component: PropTypes.func.isRequired,
  background: PropTypes.bool.isRequired,
  locale: PropTypes.string.isRequired,
  location: PropTypes.shape({ pathname: PropTypes.string.isRequired }),
  initialProps: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  hideMasthead: PropTypes.bool,
  ndlaFilm: PropTypes.bool,
  skipToContent: PropTypes.string,
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
    this.state = {
      hasError: false,
      data: props.initialProps,
      location: null,
    };
    this.handleLoadInitialProps = this.handleLoadInitialProps.bind(this);
  }

  componentDidMount() {
    if (
      window.DATA.config.disableSSR ||
      window.location.search.indexOf('disableSSR=true') > -1 ||
      (module.hot && module.hot.status() === 'apply')
    ) {
      this.handleLoadInitialProps(this.props);
    }
  }

  componentDidUpdate() {
    if (!this.state.data || this.state.data.loading === true) {
      this.handleLoadInitialProps(this.props);
    }
  }

  componentWillUnmount() {
    this.location = null;
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.location === null) {
      return {
        location: nextProps.location,
      };
    }
    const navigated = nextProps.location !== prevState.location;
    const match = matchPath(nextProps.location.pathname, SUBJECT_PAGE_PATH);
    const ignoreScroll = match?.isExact && (!!match?.params?.topicId || !!match?.params?.subTopicId);
    if (navigated) {
      // Må disables få fagside når emne er valgt 
      // window.scrollTo(0, 0);
      return {
        hasError: false,
        data: { ...prevState.data, loading: true },
        location: nextProps.location,
      };
    }

    // No state update necessary
    return null;
  }

  componentDidCatch(error, info) {
    if (process.env.NODE_ENV === 'production') {
      // React prints all errors that occurred during rendering to the console in development
      handleError(error, info);
    }
    this.setState({ hasError: true });
  }

  async handleLoadInitialProps(props) {
    if (props.location === this.location) {
      // Data for this location is already loading
      return;
    }

    this.location = props.location;
    let data = [];
    try {
      data = await loadInitialProps(props.location.pathname, {
        locale: props.locale,
        location: props.location,
        history: props.history,
        ndlaFilm: props.ndlaFilm,
      });
    } catch (e) {
      handleError(e);
    }
    // Only update state if on the same route
    if (props.location === this.location) {
      this.setState({ data: { ...data[0], loading: false } });
    }
  }

  render() {
    const {
      initialProps: { basename },
      location,
      locale,
    } = this.props;
    if (this.state.hasError) {
      return <ErrorPage locale={this.props.locale} location={location} />;
    }
    const isNdlaFilm = location.pathname.includes(FILM_PAGE_PATH);
    return (
      <BasenameContext.Provider value={basename}>
        <Switch>
          {routes
            .filter(route => route !== undefined)
            .map(route => (
              <Route
                location={location}
                key={`route_${route.path}`}
                exact={route.exact}
                hideMasthead={route.hideMasthead}
                initialProps={this.state.data}
                locale={locale}
                component={route.component}
                background={route.background}
                path={route.path}
                ndlaFilm={isNdlaFilm}
              />
            ))}
        </Switch>
      </BasenameContext.Provider>
    );
  }
}

App.propTypes = {
  locale: PropTypes.string.isRequired,
  location: PropTypes.shape({ pathname: PropTypes.string.isRequired }),
  initialProps: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default withRouter(App);
