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
import { AboutPage } from "./containers/AboutPage/AboutPage";
import { AccessDeniedPage } from "./containers/AccessDeniedPage/AccessDeniedPage";
import { AllSubjectsPage } from "./containers/AllSubjectsPage/AllSubjectsPage";
import { CollectionPage } from "./containers/CollectionPage/CollectionPage";
import ErrorPage from "./containers/ErrorPage";
import { FilmRedirectPage } from "./containers/FilmRedirect/FilmRedirectPage";
import { FavoriteSubjectsPage } from "./containers/MyNdla/FavoriteSubjects/FavoriteSubjectsPage";
import { FoldersPage } from "./containers/MyNdla/Folders/FoldersPage";
import { FoldersTagsPage } from "./containers/MyNdla/Folders/FoldersTagPage";
import { EditLearningpathNewStepLink } from "./containers/MyNdla/Learningpath/components/EditLearningpathNewStepLink";
import LearningpathStepForm from "./containers/MyNdla/Learningpath/components/LearningpathStepForm";
import { EditLearningpathStepsPage } from "./containers/MyNdla/Learningpath/EditLearningpathStepsPage";
import { EditLearningpathTitlePage } from "./containers/MyNdla/Learningpath/EditLearningpathTitlePage";
import { LearningpathCheck } from "./containers/MyNdla/Learningpath/LearningpathCheck";
import { LearningpathPage } from "./containers/MyNdla/Learningpath/LearningpathPage";
import { NewLearningpathPage } from "./containers/MyNdla/Learningpath/NewLearningpathPage";
import { PreviewLearningpathPage } from "./containers/MyNdla/Learningpath/PreviewLearningpathPage";
import { SaveLearningpathPage } from "./containers/MyNdla/Learningpath/SaveLearningpathPage";
import MyNdlaLayout from "./containers/MyNdla/MyNdlaLayout";
import { MyNdlaPage } from "./containers/MyNdla/MyNdlaPage";
import { MyProfilePage } from "./containers/MyNdla/MyProfile/MyProfilePage";
import { NotFoundPage } from "./containers/NotFoundPage/NotFoundPage";
import Layout from "./containers/Page/Layout";
import { PlainArticlePage } from "./containers/PlainArticlePage/PlainArticlePage";
import { PlainLearningpathPage } from "./containers/PlainLearningpathPage/PlainLearningpathPage";
import { PodcastSeriesListPage } from "./containers/PodcastPage/PodcastSeriesListPage";
import { PodcastSeriesPage } from "./containers/PodcastPage/PodcastSeriesPage";
import PrivateRoute from "./containers/PrivateRoute/PrivateRoute";
import { ProgrammePage } from "./containers/ProgrammePage/ProgrammePage";
import { AudioPage } from "./containers/ResourceEmbed/AudioPage";
import { ConceptPage } from "./containers/ResourceEmbed/ConceptPage";
import { H5pPage } from "./containers/ResourceEmbed/H5pPage";
import { ImagePage } from "./containers/ResourceEmbed/ImagePage";
import { VideoPage } from "./containers/ResourceEmbed/VideoPage";
import { ResourcePage } from "./containers/ResourcePage/ResourcePage";
import { SearchPage } from "./containers/SearchPage/SearchPage";
import { SharedFolderPage } from "./containers/SharedFolderPage/SharedFolderPage";
import { SubjectPage } from "./containers/SubjectPage/SubjectPage";
import { TopicPage } from "./containers/TopicPage/TopicPage";
import { WelcomePage } from "./containers/WelcomePage/WelcomePage";
import { EmbedIframePageContainer } from "./iframe/EmbedIframePageContainer";
import IframePageContainer from "./iframe/IframePageContainer";
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
        // lazy: () => import("./containers/WelcomePage/WelcomePage"),
      },
      {
        path: "subjects",
        element: <AllSubjectsPage />,
        // lazy: () => import("./containers/AllSubjectsPage/AllSubjectsPage"),
      },
      {
        path: "search",
        element: <SearchPage />,
        // lazy: () => import("./containers/SearchPage/SearchPage"),
      },
      {
        path: "utdanning/:programme/:contextId/:grade?",
        element: <ProgrammePage />,
      },
      {
        path: "samling/:collectionId",
        element: <CollectionPage />,
        // lazy: () => import("./containers/CollectionPage/CollectionPage"),
      },
      {
        path: "podkast",
        element: <PodcastSeriesListPage />,
        // lazy: () => import("./containers/PodcastPage/PodcastSeriesListPage"),
        children: [
          {
            path: ":id",
            element: <PodcastSeriesPage />,
            // lazy: () => import("./containers/PodcastPage/PodcastSeriesPage"),
          },
        ],
      },
      {
        path: "article/:articleId",
        element: <PlainArticlePage />,
        // lazy: () => import("./containers/PlainArticlePage/PlainArticlePage"),
      },
      {
        path: "learningpaths/:learningpathId",
        children: [
          {
            index: true,
            element: <PlainLearningpathPage />,
            // lazy: () => import("./containers/PlainLearningpathPage/PlainLearningpathPage"),
          },
          {
            path: "steps/:stepId",
            element: <PlainLearningpathPage />,
            // lazy: () => import("./containers/PlainLearningpathPage/PlainLearningpathPage"),
          },
        ],
      },
      {
        path: "r",
        children: [
          {
            path: ":contextId/:stepId?",
            element: <ResourcePage />,
            // lazy: () => import("./containers/ResourcePage/ResourcePage"),
          },
          {
            path: ":root/:name/:contextId/:stepId?",
            element: <ResourcePage />,
            // lazy: () => import("./containers/ResourcePage/ResourcePage"),
          },
        ],
      },
      {
        path: "e",
        children: [
          {
            path: ":contextId",
            element: <TopicPage />,
            // lazy: () => import("./containers/TopicPage/TopicPage"),
          },
          {
            path: ":root/:name/:contextId",
            element: <TopicPage />,
            // lazy: () => import("./containers/TopicPage/TopicPage"),
          },
        ],
      },
      {
        path: "f/:root?/:name?/:contextId",
        element: <SubjectPage />,
        // lazy: () => import("./containers/SubjectPage/SubjectPage"),
      },
      {
        path: "video/:videoId",
        element: <VideoPage />,
        // lazy: () => import("./containers/ResourceEmbed/VideoPage"),
      },
      {
        path: "image/:imageId",
        element: <ImagePage />,
        // lazy: () => import("./containers/ResourceEmbed/ImagePage"),
      },
      {
        path: "concept/:conceptId",
        element: <ConceptPage />,
        // lazy: () => import("./containers/ResourceEmbed/ConceptPage"),
      },
      {
        path: "audio/:audioId",
        element: <AudioPage />,
        // lazy: () => import("./containers/ResourceEmbed/AudioPage"),
      },
      {
        path: "h5p/:h5pId",
        element: <H5pPage />,
        // lazy: () => import("./containers/ResourceEmbed/H5pPage"),
      },
      {
        path: "minndla",
        element: (
          <NoSSR fallback={null}>
            <MyNdlaLayout />,
          </NoSSR>
        ),
        // lazy: () => import("./containers/MyNdla/MyNdlaLayout"),
        children: [
          {
            index: true,
            element: <MyNdlaPage />,
            // lazy: () => import("./containers/MyNdla/MyNdlaPage"),
          },
          {
            path: "folders/:folderId?",
            element: <PrivateRoute element={<FoldersPage />} />,
            // lazy: () => import("./containers/MyNdla/Folders/FoldersPage"),
          },
          {
            path: "folders/tag/:tag",
            element: <PrivateRoute element={<FoldersTagsPage />} />,
            // lazy: () => import("./containers/MyNdla/Folders/FoldersTagPage"),
          },
          {
            path: "learningpaths",
            element: <LearningpathCheck />,
            // lazy: () => import("./containers/MyNdla/Learningpath/LearningpathCheck"),
            children: [
              {
                index: true,
                element: <PrivateRoute element={<LearningpathPage />} />,
                // lazy: () => import("./containers/MyNdla/Learningpath/LearningpathPage"),
              },
              {
                path: "new",
                element: <PrivateRoute element={<NewLearningpathPage />} />,
                // lazy: () => import("./containers/MyNdla/Learningpath/NewLearningpathPage"),
              },
              {
                path: ":learningpathId/edit",
                children: [
                  {
                    path: "title",
                    element: <PrivateRoute element={<EditLearningpathTitlePage />} />,
                    // lazy: () => import("./containers/MyNdla/Learningpath/EditLearningpathTitlePage"),
                  },
                  {
                    path: "steps",
                    element: <PrivateRoute element={<EditLearningpathStepsPage />} />,
                    // lazy: () => import("./containers/MyNdla/Learningpath/EditLearningpathStepsPage"),
                    children: [
                      {
                        index: true,
                        element: <EditLearningpathNewStepLink />,
                        // lazy: () => import("./containers/MyNdla/Learningpath/components/EditLearningpathNewStepLink"),
                      },
                      {
                        path: "new",
                        element: <PrivateRoute element={<LearningpathStepForm />} />,
                        // lazy: () => import("./containers/MyNdla/Learningpath/components/LearningpathStepForm"),
                      },
                      {
                        path: ":stepId",
                        element: null,
                      },
                    ],
                  },
                ],
              },
              {
                path: ":learningpathId/save",
                element: <PrivateRoute element={<SaveLearningpathPage />} />,
                // lazy: () => import("./containers/MyNdla/Learningpath/SaveLearningpathPage"),
              },
              {
                path: ":learningpathId/preview/:stepId?",
                element: <PrivateRoute element={<PreviewLearningpathPage />} />,
                // lazy: () => import("./containers/MyNdla/Learningpath/PreviewLearningpathPage"),
              },
            ],
          },
          {
            path: "subjects",
            element: <PrivateRoute element={<FavoriteSubjectsPage />} />,
            // lazy: () => import("./containers/MyNdla/FavoriteSubjects/FavoriteSubjectsPage"),
          },
          {
            path: "profile",
            element: <PrivateRoute element={<MyProfilePage />} />,
            // lazy: () => import("./containers/MyNdla/MyProfile/MyProfilePage"),
          },
        ],
      },
      {
        path: "om/:slug",
        element: <AboutPage />,
        lazy: () => import("./containers/AboutPage/AboutPage"),
      },
      {
        path: "folder/:folderId",
        element: <SharedFolderPage />,
        // lazy: () => import("./containers/SharedFolderPage/SharedFolderPage"),
      },
      {
        path: "film",
        element: <FilmRedirectPage />,
        // lazy: () => import("./containers/FilmRedirect/FilmRedirectPage"),
      },
      {
        path: "404",
        element: <NotFoundPage />,
        // lazy: () => import("./containers/NotFoundPage/NotFoundPage"),
      },
      {
        path: "403",
        element: <AccessDeniedPage />,
        // lazy: () => import("./containers/AccessDeniedPage/AccessDeniedPage"),
      },
      {
        path: "*",
        element: <NotFoundPage />,
        // lazy: () => import("./containers/NotFoundPage/NotFoundPage"),
      },
      {
        path: "p/:articleId",
        element: <PlainArticlePage />,
        // lazy: () => import("./containers/PlainArticlePage/PlainArticlePage"),
      },
    ],
  },
];

export const iframeEmbedRoutes: RouteObject[] = [
  {
    path: "/embed-iframe/:lang?/:embedType/:embedId",
    errorElement: <ErrorElement />,
    children: [
      {
        index: true,
        element: <EmbedIframePageContainer />,
        // lazy: () => import("./iframe/EmbedIframePageContainer"),
      },
    ],
  },
];

export const iframeArticleRoutes: RouteObject[] = [
  {
    path: "/article-iframe",
    errorElement: <ErrorElement />,
    children: [
      {
        path: ":lang?/article/:articleId",
        element: <IframePageContainer />,
        // lazy: () => import("./iframe/IframePageContainer"),
      },
      {
        path: ":lang?/:taxonomyId/:articleId",
        element: <IframePageContainer />,
        // lazy: () => import("./iframe/IframePageContainer"),
      },
    ],
  },
];

export const errorRoutes: RouteObject[] = [
  {
    // This route is used for handling errors and displaying the error page. It should match all paths.
    path: "*",
    element: <ErrorPage />,
  },
];
