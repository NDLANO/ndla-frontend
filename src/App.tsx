/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Component, ReactNode } from "react";
import { Route, Routes } from "react-router-dom";
import { NoSSR } from "@ndla/util";
import { AlertsProvider } from "./components/AlertsContext";
import AuthenticationContext from "./components/AuthenticationContext";
import { BaseNameProvider } from "./components/BaseNameContext";
import Scripts from "./components/Scripts/Scripts";
import { ToastProvider } from "./components/ToastContext";
import config from "./config";
import AboutPage from "./containers/AboutPage/AboutPage";
import { AccessDeniedPage } from "./containers/AccessDeniedPage/AccessDeniedPage";
import AllSubjectsPage from "./containers/AllSubjectsPage/AllSubjectsPage";
import { CollectionPage } from "./containers/CollectionPage/CollectionPage";
import ErrorPage from "./containers/ErrorPage/ErrorPage";
import FavoriteSubjectsPage from "./containers/MyNdla/FavoriteSubjects/FavoriteSubjectsPage";
import FoldersPage from "./containers/MyNdla/Folders/FoldersPage";
import FoldersTagsPage from "./containers/MyNdla/Folders/FoldersTagPage";
import { EditLearningpathStepsPage } from "./containers/MyNdla/Learningpath/EditLearningpathStepsPage";
import { EditLearningpathTitlePage } from "./containers/MyNdla/Learningpath/EditLearningpathTitlePage";
import { LearningpathCheck } from "./containers/MyNdla/Learningpath/LearningpathCheck";
import LearningpathPage from "./containers/MyNdla/Learningpath/LearningpathPage";
import { NewLearningpathPage } from "./containers/MyNdla/Learningpath/NewLearningpathPage";
import { PreviewLearningpathPage } from "./containers/MyNdla/Learningpath/PreviewLearningpathPage";
import { SaveLearningpathPage } from "./containers/MyNdla/Learningpath/SaveLearningpathPage";
import MyNdlaLayout from "./containers/MyNdla/MyNdlaLayout";
import MyNdlaPage from "./containers/MyNdla/MyNdlaPage";
import MyProfilePage from "./containers/MyNdla/MyProfile/MyProfilePage";
import { NotFoundPage } from "./containers/NotFoundPage/NotFoundPage";
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
import { SearchPage } from "./containers/SearchPage/SearchPage";
import SharedFolderPage from "./containers/SharedFolderPage/SharedFolderPage";
import SubjectPage from "./containers/SubjectPage/SubjectPage";
import { TopicPage } from "./containers/TopicPage/TopicPage";
import WelcomePage from "./containers/WelcomePage/WelcomePage";
import handleError from "./util/handleError";

interface State {
  hasError: boolean;
}

class App extends Component<AppProps, State> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  componentDidCatch(error: Error) {
    if (config.runtimeType === "production") {
      // React prints all errors that occurred during rendering to the console in development
      handleError(error);
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
          <ToastProvider>
            <Scripts />
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<WelcomePage />} />
                <Route path="subjects" element={<AllSubjectsPage />} />
                <Route path="search" element={<SearchPage />} />
                <Route path="utdanning">
                  <Route path=":programme" element={<ProgrammePage />} />
                  <Route path=":programme/:contextId" element={<ProgrammePage />}>
                    <Route path=":grade" element={null} />
                  </Route>
                </Route>
                <Route path="samling/:collectionId" element={<CollectionPage />} />
                <Route path="podkast">
                  <Route index element={<PodcastSeriesListPage />} />
                  <Route path=":id" element={<PodcastSeriesPage />} />
                </Route>
                <Route path="article/:articleId" element={<PlainArticlePage />} />
                <Route path="learningpaths/:learningpathId" element={<PlainLearningpathPage />}>
                  <Route path="steps/:stepId" element={null} />
                </Route>
                <Route path="r" element={<ResourcePage />}>
                  <Route path=":contextId" element={null} />
                  <Route path=":contextId/:stepId" element={null} />
                  <Route path=":root/:name/:contextId" element={null} />
                  <Route path=":root/:name/:contextId/:stepId" element={null} />
                </Route>
                <Route path="e" element={<TopicPage />}>
                  <Route path=":contextId" element={null} />
                  <Route path=":root/:name/:contextId" element={null} />
                </Route>
                <Route path="f" element={<SubjectPage />}>
                  <Route path=":contextId" element={null} />
                  <Route path=":root/:contextId" element={null} />
                  <Route path=":root/:name/:contextId" element={null} />
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
                    <Route path="tag/:tag" element={<PrivateRoute element={<FoldersTagsPage />} />} />
                    <Route path=":folderId" element={<PrivateRoute element={<FoldersPage />} />} />
                  </Route>
                  <Route path="learningpaths" element={<LearningpathCheck />}>
                    <Route path="new" element={<PrivateRoute element={<NewLearningpathPage />} />} />
                    <Route path=":learningpathId/edit">
                      <Route path="title" element={<PrivateRoute element={<EditLearningpathTitlePage />} />} />
                      <Route path="steps" element={<PrivateRoute element={<EditLearningpathStepsPage />} />} />
                    </Route>
                    <Route path=":learningpathId/save" element={<PrivateRoute element={<SaveLearningpathPage />} />} />

                    <Route path=":learningpathId/preview">
                      <Route index element={<PrivateRoute element={<PreviewLearningpathPage />} />} />
                      <Route path=":stepId" element={<PrivateRoute element={<PreviewLearningpathPage />} />} />
                    </Route>
                    <Route index element={<PrivateRoute element={<LearningpathPage />} />} />
                  </Route>
                  <Route path="subjects" element={<PrivateRoute element={<FavoriteSubjectsPage />} />} />
                  <Route path="profile" element={<PrivateRoute element={<MyProfilePage />} />} />
                </Route>
                <Route path="om/:slug" element={<AboutPage />} />
                <Route path="folder/:folderId">
                  <Route index element={<SharedFolderPage />} />
                  <Route path="*" element={<SharedFolderPage />} />
                </Route>
                <Route path="404" element={<NotFoundPage />} />
                <Route path="403" element={<AccessDeniedPage />} />
                <Route path="*" element={<NotFoundPage />} />
                <Route path="p/:articleId" element={<PlainArticlePage />} />
              </Route>
            </Routes>
          </ToastProvider>
        </AuthenticationContext>
      </BaseNameProvider>
    </AlertsProvider>
  );
};

interface AppProps {
  base?: string;
}

export default App;
