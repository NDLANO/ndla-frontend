/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { configureTracker } from '@ndla/tracker';
import { OneColumn } from '@ndla/ui';
import { History } from 'history';
import { Component, ErrorInfo, ReactNode } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';
import { AlertsProvider } from './components/AlertsContext';
import AuthenticationContext from './components/AuthenticationContext';
import { BaseNameProvider } from './components/BaseNameContext';
import config from './config';
import AccessDenied from './containers/AccessDeniedPage/AccessDeniedPage';
import AllSubjectsPage from './containers/AllSubjectsPage/AllSubjectsPage';
import ErrorPage from './containers/ErrorPage/ErrorPage';
import LoginFailure from './containers/Login/LoginFailure';
import LoginProviders from './containers/Login/LoginProviders';
import LoginSuccess from './containers/Login/LoginSuccess';
import LogoutProviders from './containers/Logout/LogoutProviders';
import LogoutSession from './containers/Logout/LogoutSession';
import MyNdlaPage from './containers/MyNdlaPage/MyNdlaPage';
import NotFound from './containers/NotFoundPage/NotFoundPage';
import Layout from './containers/Page/Layout';
import PlainArticlePage from './containers/PlainArticlePage/PlainArticlePage';
import PlainLearningpathPage from './containers/PlainLearningpathPage/PlainLearningpathPage';
import PodcastSeriesListPage from './containers/PodcastPage/PodcastSeriesListPage';
import PodcastSeriesPage from './containers/PodcastPage/PodcastSeriesPage';
import PrivateRoute from './containers/PrivateRoute/PrivateRoute';
import ProgrammePage from './containers/ProgrammePage/ProgrammePage';
import ResourcePage from './containers/ResourcePage/ResourcePage';
import SearchPage from './containers/SearchPage/SearchPage';
import SubjectRouting from './containers/SubjectPage/SubjectRouting';
import WelcomePage from './containers/WelcomePage/WelcomePage';
import { LocaleType } from './interfaces';
import handleError from './util/handleError';

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

  render(): ReactNode {
    if (this.state.hasError) {
      return <ErrorPage />;
    }

    return (
      <AppRoutes resCookie={this.props.resCookie} base={this.props.base} />
    );
  }
}

const AppRoutes = ({ base, resCookie }: AppProps) => {
  return (
    <AlertsProvider>
      <BaseNameProvider value={base}>
        <AuthenticationContext initialValue={resCookie}>
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
                  <Route
                    path="minndla"
                    element={<PrivateRoute element={<MyNdlaPage />} />}
                  />
                </>
              )}
              <Route path="subjects" element={<AllSubjectsPage />} />
              <Route path="search" element={<SearchPage />} />
              <Route path="utdanning/:programme" element={<ProgrammePage />}>
                <Route path=":grade" element={null} />
              </Route>
              <Route path="podkast">
                <Route index element={<PodcastSeriesListPage />} />
                <Route path=":id" element={<PodcastSeriesPage />} />
              </Route>
              <Route path="article/:articleId" element={<PlainArticlePage />} />
              <Route
                path="learningpaths/:learningpathId"
                element={<PlainLearningpathPage />}>
                <Route path="steps/:stepId" element={null} />
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
              <Route path="subject:subjectId/topic:topic1/topic:topic2/topic:topic3/topic:topicId/resource:resourceId">
                {resourceRoutes}
              </Route>
              <Route path="subject:subjectId" element={<SubjectRouting />}>
                <Route path="topic:topicId" element={null} />
                <Route path="topic:topic1" element={null}>
                  <Route path="topic:topicId" element={null} />
                  <Route path="topic:topic2" element={null}>
                    <Route path="topic:topicId" element={null} />
                    <Route path="topic:topic3" element={null}>
                      <Route path="topic:topicId" element={null} />
                    </Route>
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
};

interface AppProps {
  base?: string;
  locale?: LocaleType;
  history?: History;
  isClient?: boolean;
  resCookie?: string;
}

export default App;
