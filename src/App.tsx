/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { configureTracker } from '@ndla/tracker';
import { SnackbarProvider } from '@ndla/ui';
import { History } from 'history';
import { Component, ErrorInfo, ReactNode } from 'react';
import { Route, Routes } from 'react-router-dom';
import ImagePage from './containers/ImagePage/ImagePage';
import ConceptPage from './containers/ConceptPage/ConceptPage';
import AudioPage from './containers/AudioPage/AudioPage';
import { AlertsProvider } from './components/AlertsContext';
import AuthenticationContext from './components/AuthenticationContext';
import { BaseNameProvider } from './components/BaseNameContext';
import config from './config';
import AccessDenied from './containers/AccessDeniedPage/AccessDeniedPage';
import AllSubjectsPage from './containers/AllSubjectsPage/AllSubjectsPage';
import ErrorPage from './containers/ErrorPage/ErrorPage';
import FoldersPage from './containers/MyNdla/Folders/FoldersPage';
import MyNdlaLayout from './containers/MyNdla/MyNdlaLayout';
import MyNdlaMobileMenuPage from './containers/MyNdla/MyNdlaMobileMenuPage';
import MyNdlaPage from './containers/MyNdla/MyNdlaPage';
import TagsPage from './containers/MyNdla/Tags/TagsPage';
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
          <SnackbarProvider>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<WelcomePage />} />
                <Route path="subjects" element={<AllSubjectsPage />} />
                <Route path="search" element={<SearchPage />} />
                <Route path="utdanning/:programme" element={<ProgrammePage />}>
                  <Route path=":grade" element={null} />
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
                <Route path="subject:subjectId/topic:topic1/topic:topic2/topic:topic3/topic:topic4/topic:topicId/resource:resourceId">
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
                        <Route path="topic:topic4" element={null}>
                          <Route path="topic:topicId" element={null} />
                        </Route>
                      </Route>
                    </Route>
                  </Route>
                </Route>
                <Route
                  path="resources/images/:imageId"
                  element={<ImagePage />}
                />
                <Route
                  path="resources/concepts/:conceptId"
                  element={<ConceptPage />}
                />
                <Route
                  path="resources/audios/:audioId"
                  element={<AudioPage />}
                />
                <Route
                  path="minndla"
                  element={<PrivateRoute element={<MyNdlaLayout />} />}>
                  <Route index element={<MyNdlaPage />} />
                  <Route path="meny" element={<MyNdlaMobileMenuPage />} />
                  <Route path="folders">
                    <Route index element={<FoldersPage />} />
                    <Route path=":folderId" element={<FoldersPage />} />
                  </Route>
                  <Route path="tags">
                    <Route index element={<TagsPage />} />
                    <Route path=":tag" element={<TagsPage />} />
                  </Route>
                </Route>
                <Route path="404" element={<NotFound />} />
                <Route path="403" element={<AccessDenied />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </SnackbarProvider>
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
