/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { RouteObject, useRouteError } from "react-router-dom";
import { NoSSR } from "@ndla/util";
import config from "./config";
import AboutPage from "./containers/AboutPage/AboutPage";
import { AccessDeniedPage } from "./containers/AccessDeniedPage/AccessDeniedPage";
import AllSubjectsPage from "./containers/AllSubjectsPage/AllSubjectsPage";
import { CollectionPage } from "./containers/CollectionPage/CollectionPage";
import ErrorPage from "./containers/ErrorPage";
import { FilmRedirectPage } from "./containers/FilmRedirect/FilmRedirectPage";
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
import ImagePage from "./containers/ResourceEmbed/ImagePage";
import VideoPage from "./containers/ResourceEmbed/VideoPage";
import ResourcePage from "./containers/ResourcePage/ResourcePage";
import { SearchPage } from "./containers/SearchPage/SearchPage";
import SharedFolderPage from "./containers/SharedFolderPage/SharedFolderPage";
import SubjectPage from "./containers/SubjectPage/SubjectPage";
import { TopicPage } from "./containers/TopicPage/TopicPage";
import WelcomePage from "./containers/WelcomePage/WelcomePage";
import handleError from "./util/handleError";

const ErrorElement = () => {
  const error = useRouteError();
  if (config.runtimeType === "production") {
    handleError(error as Error);
  }
  return <ErrorPage />;
};

export const routes: RouteObject[] = [
  {
    path: "/",
    errorElement: <ErrorElement />,
    element: <Layout />,
    children: [
      {
        index: true,
        element: <WelcomePage />,
      },
      {
        path: "subjects",
        element: <AllSubjectsPage />,
      },
      {
        path: "search",
        element: <SearchPage />,
      },
      {
        path: "utdanning/:programme/:contextId/:grade?",
        element: <ProgrammePage />,
      },
      {
        path: "samling/:collectionId",
        element: <CollectionPage />,
      },
      {
        path: "podkast",
        element: <PodcastSeriesListPage />,
        children: [{ path: ":id", element: <PodcastSeriesPage /> }],
      },
      {
        path: "article/:articleId",
        element: <PlainArticlePage />,
      },
      {
        path: "learningpaths/:learningpathId",
        children: [
          {
            index: true,
            element: <PlainLearningpathPage />,
          },
          {
            path: "steps/:stepId",
            element: <PlainLearningpathPage />,
          },
        ],
      },
      {
        path: "r",
        children: [
          { path: ":contextId/:stepId?", element: <ResourcePage /> },
          { path: ":root/:name/:contextId/:stepId?", element: <ResourcePage /> },
        ],
      },
      {
        path: "e",
        children: [
          { path: ":contextId", element: <TopicPage /> },
          { path: ":root/:name/:contextId", element: <TopicPage /> },
        ],
      },
      {
        path: "f/:root?/:name?/:contextId",
        element: <SubjectPage />,
      },
      {
        path: "video/:videoId",
        element: <VideoPage />,
      },
      {
        path: "image/:imageId",
        element: <ImagePage />,
      },
      {
        path: "concept/:conceptId",
        element: <ConceptPage />,
      },
      {
        path: "audio/:audioId",
        element: <AudioPage />,
      },
      {
        path: "h5p/:h5pId",
        element: <AudioPage />,
      },
      {
        path: "minndla",
        element: (
          <NoSSR fallback={null}>
            <MyNdlaLayout />
          </NoSSR>
        ),
        children: [
          {
            index: true,
            element: <MyNdlaPage />,
          },
          {
            path: "folders",
            element: <PrivateRoute element={<FoldersPage />} />,
            children: [
              {
                path: "tag/:tag",
                element: <PrivateRoute element={<FoldersTagsPage />} />,
              },
              {
                path: ":folderId",
                element: <PrivateRoute element={<FoldersPage />} />,
              },
            ],
          },
          {
            path: "learningpaths",
            element: <LearningpathCheck />,
            children: [
              {
                index: true,
                element: <PrivateRoute element={<LearningpathPage />} />,
              },
              {
                path: "new",
                element: <PrivateRoute element={<NewLearningpathPage />} />,
              },
              {
                path: ":learningpathId/edit",
                children: [
                  {
                    path: "title",
                    element: <PrivateRoute element={<EditLearningpathTitlePage />} />,
                  },
                  {
                    path: "steps",
                    element: <PrivateRoute element={<EditLearningpathStepsPage />} />,
                  },
                ],
              },
              {
                path: ":learningpathId/save",
                element: <PrivateRoute element={<SaveLearningpathPage />} />,
              },
              {
                path: ":learningpathId/preview/:stepId?",
                element: <PrivateRoute element={<PreviewLearningpathPage />} />,
              },
            ],
          },
          {
            path: "subjects",
            element: <PrivateRoute element={<FavoriteSubjectsPage />} />,
          },
          {
            path: "profile",
            element: <PrivateRoute element={<MyProfilePage />} />,
          },
        ],
      },
      {
        path: "om/:slug",
        element: <AboutPage />,
      },
      {
        path: "folder/:folderId",
        element: <SharedFolderPage />,
      },
      {
        path: "film",
        element: <FilmRedirectPage />,
      },
      {
        path: "404",
        element: <NotFoundPage />,
      },
      {
        path: "403",
        element: <AccessDeniedPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
      {
        path: "p/:articleId",
        element: <PlainArticlePage />,
      },
    ],
  },
];
