/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { ErrorInfo } from 'react';
import {
  Route,
  RouteProps,
  matchPath,
  withRouter,
  Switch,
  RouteComponentProps,
} from 'react-router-dom';
// @ts-ignore
import { Content } from '@ndla/ui';
import * as H from 'history';
import loadable from '@loadable/component';
import Page from './containers/Page/Page';

import { RootComponentProps, routes, RouteType } from './routes';
// @ts-ignore
import handleError from './util/handleError';

import {
  FILM_PAGE_PATH,
  MULTIDISCIPLINARY_SUBJECT_ARTICLE_PAGE_PATH,
  SKIP_TO_CONTENT_ID,
  SUBJECT_PAGE_PATH,
} from './constants';
import { InitialProps, LocaleType } from './interfaces';
// @ts-ignore
const Masthead = loadable(() => import('./containers/Masthead'));
// @ts-ignore
const ErrorPage = loadable(() => import('./containers/ErrorPage/ErrorPage'));

export const BasenameContext = React.createContext('');

interface NDLARouteProps extends RouteProps {
  initialProps?: InitialProps;
  locale: LocaleType;
  background: boolean;
  hideMasthead?: boolean;
  ndlaFilm?: boolean;
  skipToContent?: string;
  hideBreadcrumb?: boolean;
  component: React.ComponentType<RootComponentProps>;
}

const NDLARoute = ({
  component: Component,
  initialProps,
  locale,
  background,
  hideMasthead,
  ndlaFilm,
  skipToContent,
  location,
  hideBreadcrumb,
  ...rest
}: NDLARouteProps) => {
  return (
    <Route
      location={location}
      {...rest}
      render={(props: RouteComponentProps) => {
        return (
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
                  hideBreadcrumb={hideBreadcrumb}
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
        );
      }}
    />
  );
};

async function loadInitialProps(pathname: string, ctx: AppProps) {
  const promises: any[] = [];
  routes.some((route: RouteType) => {
    const match = matchPath(pathname, route);
    // @ts-ignore
    if (match && route.component.getInitialProps) {
      // @ts-ignore
      promises.push(route.component.getInitialProps({ match, ...ctx }));
    }
    return !!match;
  });
  return Promise.all(promises);
}

interface MatchParams {
  topicId?: string;
  topic1?: string;
  topicPath?: string;
}

function shouldScrollToTop(location: H.Location) {
  const multiMatch = matchPath<MatchParams>(
    location.pathname,
    MULTIDISCIPLINARY_SUBJECT_ARTICLE_PAGE_PATH,
  );
  if (multiMatch?.isExact) {
    return (
      multiMatch?.params?.topicId || multiMatch?.params?.topic1 === undefined
    );
  }
  const subjectMatch = matchPath<MatchParams>(
    location.pathname,
    SUBJECT_PAGE_PATH,
  );
  if (subjectMatch?.isExact) {
    return (
      !subjectMatch?.params?.topicPath ||
      subjectMatch?.params?.topicPath?.includes('resource:')
    );
  }
  return true;
}

interface AppProps extends RouteComponentProps {
  initialProps: InitialProps;
  locale: LocaleType;
}

interface AppState {
  hasError: boolean;
  data: InitialProps;
  location: H.Location | null;
}

class App extends React.Component<AppProps, AppState> {
  private location: H.Location | null;

  constructor(props: AppProps) {
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
      window.DATA?.config?.disableSSR ||
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

  static getDerivedStateFromProps(
    nextProps: AppProps,
    prevState: AppState,
  ): AppState {
    if (prevState.location === null) {
      return {
        ...prevState,
        location: nextProps.location,
      };
    }
    const navigated = nextProps.location !== prevState.location;
    if (navigated) {
      if (shouldScrollToTop(nextProps.location)) {
        window.scrollTo(0, 0);
      }
      return {
        hasError: false,
        data: { ...prevState.data, loading: true },
        location: nextProps.location,
      };
    }

    // No state update necessary
    return prevState;
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (process.env.NODE_ENV === 'production') {
      // React prints all errors that occurred during rendering to the console in development
      handleError(error, info);
    }
    this.setState({ hasError: true });
  }

  async handleLoadInitialProps(props: AppProps) {
    if (props.location === this.location) {
      // Data for this location is already loading
      return;
    }

    this.location = props.location;
    let data = [];
    try {
      data = await loadInitialProps(props.location.pathname, props);
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
              <NDLARoute
                key={`route_${route.path}`}
                exact={route.exact}
                hideMasthead={route.hideMasthead}
                hideBreadcrumb={route.hideBreadcrumb}
                initialProps={this.state.data}
                locale={locale}
                component={route.component}
                background={route.background ?? false}
                path={route.path}
                ndlaFilm={isNdlaFilm}
                location={location}
              />
            ))}
        </Switch>
      </BasenameContext.Provider>
    );
  }
}

export default withRouter(App);
