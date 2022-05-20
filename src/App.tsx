/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ErrorInfo, Component } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';
import { History } from 'history';
import { configureTracker } from '@ndla/tracker';
import { OneColumn } from '@ndla/ui';
import handleError from './util/handleError';
import ErrorPage from './containers/ErrorPage/ErrorPage';
import { LocaleType } from './interfaces';
import AuthenticationContext from './components/AuthenticationContext';
import { BaseNameProvider } from './components/BaseNameContext';
import { AlertsProvider } from './components/AlertsContext';
import Layout from './containers/Page/Layout';
import WelcomePage from './containers/WelcomePage/WelcomePage';
import ProgrammePage from './containers/ProgrammePage/ProgrammePage';
import AllSubjectsPage from './containers/AllSubjectsPage/AllSubjectsPage';
import NotFound from './containers/NotFoundPage/NotFoundPage';
import ResourcePage from './containers/ResourcePage/ResourcePage';
import SubjectRouting from './containers/SubjectPage/SubjectRouting';
import SearchPage from './containers/SearchPage/SearchPage';
import PlainArticlePage from './containers/PlainArticlePage/PlainArticlePage';
import PlainLearningpathPage from './containers/PlainLearningpathPage/PlainLearningpathPage';
import AccessDenied from './containers/AccessDeniedPage/AccessDeniedPage';
import PodcastSeriesListPage from './containers/PodcastPage/PodcastSeriesListPage';
import PodcastSeriesPage from './containers/PodcastPage/PodcastSeriesPage';
import config from './config';
import LogoutSession from './containers/Logout/LogoutSession';
import LogoutProviders from './containers/Logout/LogoutProviders';
import LoginProviders from './containers/Login/LoginProviders';
import LoginSuccess from './containers/Login/LoginSuccess';
import LoginFailure from './containers/Login/LoginFailure';
// interface NDLARouteProps extends RouteProps {
//   isCompat?: boolean;
//   initialProps?: InitialProps;
//   locale: LocaleType;
//   background: boolean;
//   hideMasthead?: boolean;
//   ndlaFilm?: boolean;
//   skipToContent?: string;
//   hideBreadcrumb?: boolean;
//   initialSelectMenu?: string;
//   component: ComponentType<RootComponentProps>;
// }

// const NDLARoute = ({
//   component: Component,
//   initialProps,
//   locale,
//   background,
//   hideMasthead,
//   ndlaFilm,
//   skipToContent,
//   location,
//   hideBreadcrumb,
//   initialSelectMenu,
//   isCompat,
//   ...rest
// }: NDLARouteProps) => {
//   return (
//     <Route
//       location={location}
//       {...rest}
//       render={(props: RouteComponentProps) => {
//         return (
//           <Page background={background} ndlaFilm={ndlaFilm}>
//             {!hideMasthead && (
//               <Masthead
//                 skipToMainContentId={SKIP_TO_CONTENT_ID}
//                 locale={locale}
//                 ndlaFilm={ndlaFilm}
//                 hideBreadcrumb={hideBreadcrumb}
//                 initialSelectMenu={initialSelectMenu}
//                 {...props}
//               />
//             )}
//             <Content>
//               <Component
//                 {...props}
//                 locale={locale}
//                 ndlaFilm={ndlaFilm}
//                 skipToContentId={SKIP_TO_CONTENT_ID}
//                 {...initialProps}
//               />
//             </Content>
//           </Page>
//         );
//       }}
//     />
//   );
// };

// async function loadInitialProps(pathname: string, ctx: AppProps) {
//   const promises: any[] = [];
//   routes.some((route: RouteType) => {
//     const match = matchPath(pathname, route);
//     // @ts-ignore
//     if (match && route.component.getInitialProps) {
//       // @ts-ignore
//       promises.push(route.component.getInitialProps({ match, ...ctx }));
//     }
//     return !!match;
//   });
//   return Promise.all(promises);
// }

// interface MatchParams {
//   topicId?: string;
//   topic1?: string;
//   topicPath?: string;
// }

// const isSearchUpdate = (prevLocation: H.Location, nextLocation: H.Location) => {
//   if (
//     nextLocation.pathname === '/search' &&
//     prevLocation.pathname === '/search'
//   ) {
//     return true;
//   }
//   return false;
// };

// function shouldScrollToTop(location: H.Location) {
//   const multiMatch = matchPath<MatchParams>(
//     location.pathname,
//     MULTIDISCIPLINARY_SUBJECT_ARTICLE_PAGE_PATH,
//   );
//   if (multiMatch?.isExact) {
//     return (
//       multiMatch?.params?.topicId || multiMatch?.params?.topic1 === undefined
//     );
//   }
//   const subjectMatch = matchPath<MatchParams>(
//     location.pathname,
//     SUBJECT_PAGE_PATH,
//   );
//   if (subjectMatch?.isExact) {
//     return (
//       !subjectMatch?.params?.topicPath ||
//       subjectMatch?.params?.topicPath?.includes('resource:')
//     );
//   }
//   return true;
// }

// interface AppProps extends RouteComponentProps, WithTranslation {
//   isClient: boolean;
//   initialProps: InitialProps;
//   locale?: LocaleType;
//   client: ApolloClient<object>;
//   base?: string;
//   versionHash?: string;
// }

interface State {
  hasError: boolean;
}

const resourceRoutes = (
  <>
    <Route index element={<ResourcePage />} />
    <Route path=":stepId" element={<ResourcePage />} />
  </>
);

const FeideUi = () => (
  <OneColumn cssModifier="clear">
    <div className="u-2/3@desktop u-push-1/3@desktop">
      <Outlet />
    </div>
  </OneColumn>
);

class App extends Component<AppProps, State> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      hasError: false,
    };
    if (props.isClient && props.history) {
      configureTracker({
        listen: props.history.listen,
        gaTrackingId: window.location.host ? config?.gaTrackingId : '',
        googleTagManagerId: config?.googleTagManagerId,
      });
    }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (process.env.NODE_ENV === 'production') {
      // React prints all errors that occurred during rendering to the console in development
      handleError(error, info);
    }
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorPage />;
    }
    return (
      <AlertsProvider>
        <BaseNameProvider value={this.props.locale}>
          <AuthenticationContext>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<WelcomePage />} />
                {config?.feideEnabled && (
                  <>
                    <Route path="login" element={<FeideUi />}>
                      <Route index element={<LoginProviders />} />
                      <Route path={'success'} element={<LoginSuccess />} />
                      <Route path={'failure'} element={<LoginFailure />} />
                    </Route>
                    <Route path="logout" element={<FeideUi />}>
                      <Route index element={<LogoutProviders />} />
                      <Route path="session" element={<LogoutSession />} />
                    </Route>
                  </>
                )}
                <Route path="subjects" element={<AllSubjectsPage />} />
                <Route path="search" element={<SearchPage />} />
                <Route path="utdanning/:programme" element={<ProgrammePage />}>
                  <Route path=":grade" />
                </Route>
                <Route path="podkast">
                  <Route index element={<PodcastSeriesListPage />} />
                  <Route path=":id" element={<PodcastSeriesPage />} />
                </Route>
                <Route
                  path="article/:articleId"
                  element={<PlainArticlePage />}
                />
                <Route
                  path="learningpaths/:learningpathId"
                  element={<PlainLearningpathPage />}>
                  <Route path="steps/:stepId" />
                </Route>
                <Route path="subject:subjectId/topic:topicId/resource:resourceId">
                  {resourceRoutes}
                </Route>
                <Route path="subject:subjectId/topic:topic1/topic:topicId/resource:resourceId">
                  {resourceRoutes}
                </Route>
                <Route path="subject:subjectId/topic:topic1/topic:topic2/topic:topicId/resource:resourceId">
                  {resourceRoutes}
                </Route>
                <Route path="subject:subjectId" element={<SubjectRouting />}>
                  <Route path="topic:topicId" />
                  <Route path="topic:topic1">
                    <Route path="topic:topicId" />
                    <Route path="topic:topic2">
                      <Route path="topic:topicId" />
                    </Route>
                  </Route>
                </Route>
                <Route path="404" element={<NotFound />} />
                <Route path="403" element={<AccessDenied />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </AuthenticationContext>
        </BaseNameProvider>
      </AlertsProvider>
    );
  }
}

interface AppProps {
  locale?: LocaleType;
  history?: History;
  isClient?: boolean;
}

export default App;

// class App extends Component<AppProps, AppState> {
//   private location: H.Location | null;

//   constructor(props: AppProps) {
//     super(props);
//     this.location = null;
//     initializeI18n(
//       props.i18n,
//       props.client,
//       props.initialProps.resCookie,
//       props.versionHash,
//     );
//     props.i18n.changeLanguage(props.locale);
//     this.state = {
//       hasError: false,
//       data: props.initialProps,
//       location: null,
//     };
//     if (props.isClient) {
//       configureTracker({
//         listen: props.history.listen,
//         gaTrackingId: window.location.host ? config?.gaTrackingId : '',
//         googleTagManagerId: config?.googleTagManagerId,
//       });
//     }
//     this.handleLoadInitialProps = this.handleLoadInitialProps.bind(this);
//   }

//   componentDidMount() {
//     if (
//       window.DATA?.config?.disableSSR ||
//       window.location.search.indexOf('disableSSR=true') > -1 ||
//       (module.hot && module.hot.status() === 'apply')
//     ) {
//       this.handleLoadInitialProps(this.props);
//     }
//   }

//   componentDidUpdate() {
//     if (this.props.isClient) {
//       const [, maybeUrlLocale, ...rest] = window.location.pathname.split('/');
//       const urlLocale = isValidLocale(maybeUrlLocale)
//         ? maybeUrlLocale
//         : undefined;
//       if (!urlLocale && this.props.base === '') {
//         // return because base does not exist. It means we are on the default locale.
//         return;
//       } else if (urlLocale && this.props.base === urlLocale) {
//         // return becase the url and the base are equal.
//         return;
//       } else if (urlLocale) {
//         // replace the url because base and url are not equal.
//         const path = rest.join('/');
//         const fullPath = path.startsWith('/') ? path : `/${path}`;
//         this.props.history.replace(`${fullPath}${this.props.location.search}`);
//       } else {
//         // simply trigger a replace with the new base to get an updated location base.
//         this.props.history.replace(window.location.pathname);
//       }
//     }

//     if (!this.state.data || this.state.data.loading === true) {
//       this.handleLoadInitialProps(this.props);
//     }
//   }

//   componentWillUnmount() {
//     this.location = null;
//   }

//   static getDerivedStateFromProps(
//     nextProps: AppProps,
//     prevState: AppState,
//   ): AppState {
//     if (prevState.location === null) {
//       return {
//         ...prevState,
//         location: nextProps.location,
//       };
//     }
//     const navigated = nextProps.location !== prevState.location;
//     const updateSearch = isSearchUpdate(nextProps.location, prevState.location);
//     if (navigated && !updateSearch) {
//       if (shouldScrollToTop(nextProps.location)) {
//         window.scrollTo(0, 0);
//       }
//       return {
//         hasError: false,
//         data: { ...prevState.data, loading: true },
//         location: nextProps.location,
//       };
//     }

//     // No state update necessary
//     return prevState;
//   }

//   componentDidCatch(error: Error, info: ErrorInfo) {
//     if (process.env.NODE_ENV === 'production') {
//       // React prints all errors that occurred during rendering to the console in development
//       handleError(error, info);
//     }
//     this.setState({ hasError: true });
//   }

//   async handleLoadInitialProps(props: AppProps) {
//     if (props.location === this.location) {
//       // Data for this location is already loading
//       return;
//     }

//     this.location = props.location;
//     let data = [];
//     try {
//       data = await loadInitialProps(props.location.pathname, props);
//     } catch (e) {
//       handleError(e);
//     }
//     // Only update state if on the same route
//     if (props.location === this.location) {
//       this.setState({ data: { ...data[0], loading: false } });
//     }
//   }

//   render() {
//     const { location } = this.props;

//     if (this.state.hasError) {
//       return (
//         //@ts-ignore
//         <ErrorPage locale={this.props.i18n.language} location={location} />
//       );
//     }

//     const isNdlaFilm = location.pathname.includes(FILM_PAGE_PATH);
//     return (
//       <AlertsProvider>
//         <BaseNameProvider value={this.props.locale}>
//           <AuthenticationContext>
//             <Switch>
//               {routes
//                 .filter(route => route !== undefined)
//                 .map(route => (
//                   <NDLARoute
//                     key={`route_${route.path}`}
//                     exact={route.exact}
//                     hideMasthead={route.hideMasthead}
//                     hideBreadcrumb={route.hideBreadcrumb}
//                     initialSelectMenu={route.initialSelectMenu}
//                     initialProps={this.state.data}
//                     isCompat={route.isCompat}
//                     //@ts-ignore
//                     locale={this.props.i18n.language}
//                     component={route.component}
//                     background={route.background ?? false}
//                     path={route.path}
//                     ndlaFilm={isNdlaFilm}
//                     location={location}
//                   />
//                 ))}
//             </Switch>
//           </AuthenticationContext>
//         </BaseNameProvider>
//       </AlertsProvider>
//     );
//   }
// }

// export default withRouter(withTranslation()(App));
