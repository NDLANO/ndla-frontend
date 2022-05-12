/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ErrorInfo, ComponentType, Component } from 'react';
import { configureTracker } from '@ndla/tracker';
import {
  Route,
  RouteProps,
  matchPath,
  withRouter,
  Switch,
  RouteComponentProps,
} from 'react-router-dom';
import { Content } from '@ndla/ui';
import * as H from 'history';
import { WithTranslation, withTranslation } from 'react-i18next';
import { ApolloClient } from '@apollo/client';
import Page from './containers/Page/Page';
import Masthead from './containers/Masthead';
import { RootComponentProps, routes, RouteType } from './routes';
import handleError from './util/handleError';
import ErrorPage from './containers/ErrorPage/ErrorPage';
import {
  FILM_PAGE_PATH,
  MULTIDISCIPLINARY_SUBJECT_ARTICLE_PAGE_PATH,
  SKIP_TO_CONTENT_ID,
  SUBJECT_PAGE_PATH,
} from './constants';
import { InitialProps, LocaleType } from './interfaces';
import { initializeI18n, isValidLocale } from './i18n';
import config from './config';
import AuthenticationContext from './components/AuthenticationContext';
import { BaseNameProvider } from './components/BaseNameContext';
import { AlertsProvider } from './components/AlertsContext';
import { CompatRoute } from 'react-router-dom-v5-compat';
interface NDLARouteProps extends RouteProps {
  isCompat?: boolean;
  initialProps?: InitialProps;
  locale: LocaleType;
  background: boolean;
  hideMasthead?: boolean;
  ndlaFilm?: boolean;
  skipToContent?: string;
  hideBreadcrumb?: boolean;
  initialSelectMenu?: string;
  component: ComponentType<RootComponentProps>;
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
  initialSelectMenu,
  isCompat,
  ...rest
}: NDLARouteProps) => {
  const RouteComponent = isCompat ? CompatRoute : Route;
  return (
    <RouteComponent
      location={location}
      {...rest}
      render={(props: RouteComponentProps) => {
        return (
          <Page background={background} ndlaFilm={ndlaFilm} location={location}>
            {!hideMasthead && (
              <Masthead
                skipToMainContentId={SKIP_TO_CONTENT_ID}
                locale={locale}
                ndlaFilm={ndlaFilm}
                hideBreadcrumb={hideBreadcrumb}
                initialSelectMenu={initialSelectMenu}
                {...props}
              />
            )}
            <Content>
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

const isSearchUpdate = (prevLocation: H.Location, nextLocation: H.Location) => {
  if (
    nextLocation.pathname === '/search' &&
    prevLocation.pathname === '/search'
  ) {
    return true;
  }
  return false;
};

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

interface AppProps extends RouteComponentProps, WithTranslation {
  isClient: boolean;
  initialProps: InitialProps;
  locale?: LocaleType;
  client: ApolloClient<object>;
  base?: string;
  versionHash?: string;
}

interface AppState {
  hasError: boolean;
  data: InitialProps;
  location: H.Location | null;
}

class App extends Component<AppProps, AppState> {
  private location: H.Location | null;

  constructor(props: AppProps) {
    super(props);
    this.location = null;
    initializeI18n(
      props.i18n,
      props.client,
      props.initialProps.resCookie,
      props.versionHash,
    );
    props.i18n.changeLanguage(props.locale);
    this.state = {
      hasError: false,
      data: props.initialProps,
      location: null,
    };
    if (props.isClient) {
      configureTracker({
        listen: props.history.listen,
        gaTrackingId: window.location.host ? config?.gaTrackingId : '',
        googleTagManagerId: config?.googleTagManagerId,
      });
    }
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
    if (this.props.isClient) {
      const [, maybeUrlLocale, ...rest] = window.location.pathname.split('/');
      const urlLocale = isValidLocale(maybeUrlLocale)
        ? maybeUrlLocale
        : undefined;
      if (!urlLocale && this.props.base === '') {
        // return because base does not exist. It means we are on the default locale.
        return;
      } else if (urlLocale && this.props.base === urlLocale) {
        // return becase the url and the base are equal.
        return;
      } else if (urlLocale) {
        // replace the url because base and url are not equal.
        const path = rest.join('/');
        const fullPath = path.startsWith('/') ? path : `/${path}`;
        this.props.history.replace(`${fullPath}${this.props.location.search}`);
      } else {
        // simply trigger a replace with the new base to get an updated location base.
        this.props.history.replace(window.location.pathname);
      }
    }

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
    const updateSearch = isSearchUpdate(nextProps.location, prevState.location);
    if (navigated && !updateSearch) {
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
    const { location } = this.props;

    if (this.state.hasError) {
      return (
        //@ts-ignore
        <ErrorPage locale={this.props.i18n.language} location={location} />
      );
    }

    const isNdlaFilm = location.pathname.includes(FILM_PAGE_PATH);
    return (
      <AlertsProvider>
        <BaseNameProvider value={this.props.locale}>
          <AuthenticationContext>
            <Switch>
              {routes
                .filter(route => route !== undefined)
                .map(route => (
                  <NDLARoute
                    key={`route_${route.path}`}
                    exact={route.exact}
                    hideMasthead={route.hideMasthead}
                    hideBreadcrumb={route.hideBreadcrumb}
                    initialSelectMenu={route.initialSelectMenu}
                    initialProps={this.state.data}
                    isCompat={route.isCompat}
                    //@ts-ignore
                    locale={this.props.i18n.language}
                    component={route.component}
                    background={route.background ?? false}
                    path={route.path}
                    ndlaFilm={isNdlaFilm}
                    location={location}
                  />
                ))}
            </Switch>
          </AuthenticationContext>
        </BaseNameProvider>
      </AlertsProvider>
    );
  }
}

export default withRouter(withTranslation()(App));
