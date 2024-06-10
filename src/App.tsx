/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Component, ErrorInfo, ReactNode } from "react";
import { Route, Routes } from "react-router-dom";
import { SnackbarProvider } from "@ndla/ui";
import { NoSSR } from "@ndla/util";
import { AlertsProvider } from "./components/AlertsContext";
import AuthenticationContext from "./components/AuthenticationContext";
import { BaseNameProvider } from "./components/BaseNameContext";
import Scripts from "./components/Scripts/Scripts";
import config from "./config";
import AboutPage from "./containers/AboutPage/AboutPage";
import AccessDenied from "./containers/AccessDeniedPage/AccessDeniedPage";
import AllSubjectsPage from "./containers/AllSubjectsPage/AllSubjectsPage";
import ErrorPage from "./containers/ErrorPage/ErrorPage";
import ArenaAdminPage from "./containers/MyNdla/Arena/ArenaAdminPage";
import ArenaFlagPage from "./containers/MyNdla/Arena/ArenaFlagPage";
import ArenaNotificationPage from "./containers/MyNdla/Arena/ArenaNotificationsPage";
import ArenaPage from "./containers/MyNdla/Arena/ArenaPage";
import ArenaSingleFlagPage from "./containers/MyNdla/Arena/ArenaSingleFlagPage";
import ArenaUserListPage from "./containers/MyNdla/Arena/ArenaUserListPage";
import CategoryEditPage from "./containers/MyNdla/Arena/CategoryEditPage";
import NewCategoryPage from "./containers/MyNdla/Arena/NewCategoryPage";
import { NewTopicPage } from "./containers/MyNdla/Arena/NewTopicPage";
import PostsPage from "./containers/MyNdla/Arena/PostsPage";
import TopicPage from "./containers/MyNdla/Arena/TopicPage";
import ArenaUserPage from "./containers/MyNdla/ArenaUserPage";
import FavoriteSubjectsPage from "./containers/MyNdla/FavoriteSubjects/FavoriteSubjectsPage";
import FoldersPage from "./containers/MyNdla/Folders/FoldersPage";
import PreviewFoldersPage from "./containers/MyNdla/Folders/PreviewFoldersPage";
import MyNdlaLayout from "./containers/MyNdla/MyNdlaLayout";
import MyNdlaPage from "./containers/MyNdla/MyNdlaPage";
import MyProfilePage from "./containers/MyNdla/MyProfile/MyProfilePage";
import TagsPage from "./containers/MyNdla/Tags/TagsPage";
import NotFound from "./containers/NotFoundPage/NotFoundPage";
import Layout from "./containers/Page/Layout";
import PlainArticlePage from "./containers/PlainArticlePage/PlainArticlePage";
import PlainLearningpathPage from "./containers/PlainLearningpathPage/PlainLearningpathPage";
import PodcastSeriesListPage from "./containers/PodcastPage/PodcastSeriesListPage";
import PodcastSeriesPage from "./containers/PodcastPage/PodcastSeriesPage";
import PrivateRoute from "./containers/PrivateRoute/PrivateRoute";
import ProgrammePage from "./containers/ProgrammePage/ProgrammePage";
import AudioPage from "./containers/ResourceEmbed/AudioPage";
import ConceptPage from "./containers/ResourceEmbed/ConceptPage";
import H5pPage from "./containers/ResourceEmbed/H5pPage";
import ImagePage from "./containers/ResourceEmbed/ImagePage";
import VideoPage from "./containers/ResourceEmbed/VideoPage";
import ResourcePage from "./containers/ResourcePage/ResourcePage";
import SearchPage from "./containers/SearchPage/SearchPage";
import SharedFolderPage from "./containers/SharedFolderPage/SharedFolderPage";
import SharedFolderPageV2 from "./containers/SharedFolderPage/SharedFolderPageV2";
import SubjectRouting from "./containers/SubjectPage/SubjectRouting";
import WelcomePage from "./containers/WelcomePage/WelcomePage";
import handleError from "./util/handleError";

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
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (config.runtimeType === "production") {
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
            <Scripts />
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<WelcomePage />} />
                <Route path="subjects" element={<AllSubjectsPage />} />
                <Route path="search" element={<SearchPage />} />
                <Route path="utdanning/*" element={<ProgrammePage />} />
                <Route path="podkast">
                  <Route index element={<PodcastSeriesListPage />} />
                  <Route path=":id" element={<PodcastSeriesPage />} />
                </Route>
                <Route path="article/:articleId" element={<PlainArticlePage />} />
                <Route path="learningpaths/:learningpathId" element={<PlainLearningpathPage />}>
                  <Route path="steps/:stepId" element={null} />
                </Route>
                <Route path="subject:subjectId/topic:topicId/resource:resourceId">{resourceRoutes}</Route>
                <Route path="subject:subjectId/topic:topic1/topic:topicId/resource:resourceId">{resourceRoutes}</Route>
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
                <Route path="video/:videoId" element={<VideoPage />} />
                <Route path="image/:imageId" element={<ImagePage />} />
                <Route path="concept/:conceptId" element={<ConceptPage />} />
                <Route path="audio/:audioId" element={<AudioPage />} />
                <Route path="h5p/:h5pId" element={<H5pPage />} />
                <Route
                  path="minndla"
                  element={
                    <NoSSR fallback={null}>
                      <MyNdlaLayout />
                    </NoSSR>
                  }
                >
                  <Route index element={<MyNdlaPage />} />
                  <Route path="folders">
                    <Route index element={<PrivateRoute element={<FoldersPage />} />} />
                    <Route path="preview/:folderId">
                      <Route index element={<PrivateRoute element={<PreviewFoldersPage />} />} />
                      <Route path=":subfolderId" element={<PrivateRoute element={<PreviewFoldersPage />} />} />
                      <Route
                        path=":subfolderId/:resourceId"
                        element={<PrivateRoute element={<PreviewFoldersPage />} />}
                      />
                    </Route>
                    <Route path=":folderId" element={<PrivateRoute element={<FoldersPage />} />} />
                  </Route>
                  <Route path="arena">
                    <Route index element={<PrivateRoute element={<ArenaPage />} />} />
                    <Route path="category/new" element={<PrivateRoute element={<NewCategoryPage />} />} />
                    <Route path="category/:categoryId">
                      <Route index element={<PrivateRoute element={<TopicPage />} />} />
                      <Route path="edit" element={<PrivateRoute element={<CategoryEditPage />} />} />
                      <Route path="topic/new" element={<PrivateRoute element={<NewTopicPage />} />} />
                    </Route>
                    <Route path="topic/:topicId" element={<PrivateRoute element={<PostsPage />} />} />
                    <Route path="notifications" element={<PrivateRoute element={<ArenaNotificationPage />} />} />
                    <Route path="user/:username" element={<PrivateRoute element={<ArenaUserPage />} />} />
                  </Route>
                  <Route path="admin">
                    <Route index element={<PrivateRoute element={<ArenaAdminPage />} />} />
                    <Route path="users" element={<PrivateRoute element={<ArenaUserListPage />} />} />
                    <Route path="flags">
                      <Route index element={<PrivateRoute element={<ArenaFlagPage />} />} />
                      <Route path=":postId" element={<PrivateRoute element={<ArenaSingleFlagPage />} />} />
                    </Route>
                  </Route>
                  <Route path="tags">
                    <Route index element={<PrivateRoute element={<TagsPage />} />} />
                    <Route path=":tag" element={<PrivateRoute element={<TagsPage />} />} />
                  </Route>
                  <Route path="subjects" element={<PrivateRoute element={<FavoriteSubjectsPage />} />} />
                  <Route path="profile" element={<PrivateRoute element={<MyProfilePage />} />} />
                </Route>
                <Route path="about/:slug" element={<AboutPage />} />

                {config.folderRedesign ? (
                  <Route path="folder/:folderId" element={<SharedFolderPageV2 />} />
                ) : (
                  <Route path="folder/:folderId">
                    <Route index element={<SharedFolderPage />} />
                    <Route path=":subfolderId" element={<SharedFolderPage />} />
                    <Route path=":subfolderId/:resourceId" element={<SharedFolderPage />} />
                  </Route>
                )}
                <Route path="404" element={<NotFound />} />
                <Route path="403" element={<AccessDenied />} />
                <Route path="*" element={<NotFound />} />
                <Route path="p/:articleId" element={<PlainArticlePage />} />
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
}

export default App;
