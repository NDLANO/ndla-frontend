/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ErrorInfo, Component, ReactNode } from 'react';
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

    return <AppRoutes base={this.props.base} />;
  }
}

const AppRoutes = ({ base }: AppProps) => {
  return (
    <AlertsProvider>
      <BaseNameProvider value={base}>
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
                <Route path=":grade" element={null} />
              </Route>
              <Route path="podkast" element={null}>
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
              <Route path="subject:subjectId" element={<SubjectRouting />}>
                <Route path="topic:topicId" element={null} />
                <Route path="topic:topic1" element={null}>
                  <Route path="topic:topicId" element={null} />
                  <Route path="topic:topic2" element={null}>
                    <Route path="topic:topicId" element={null} />
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
}

export default App;
