/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { RouteObject } from "react-router";
import ErrorPage from "./containers/ErrorPage";
import Layout from "./containers/Page/Layout";
import { ErrorElement } from "./RouteErrorElement";

export const routes: RouteObject[] = [
  {
    path: "/",
    errorElement: <ErrorElement />,
    element: <Layout />,
    children: [
      {
        index: true,
        lazy: () => import("./containers/WelcomePage/WelcomePage"),
      },
      {
        path: "subjects",
        lazy: () => import("./containers/AllSubjectsPage/AllSubjectsPage"),
      },
      {
        path: "search",
        lazy: () => import("./containers/SearchPage/SearchPage"),
      },
      {
        path: "utdanning/:programme/:contextId/:grade?",
        lazy: () => import("./containers/ProgrammePage/ProgrammePage"),
      },
      {
        path: "samling/:collectionId",
        lazy: () => import("./containers/CollectionPage/CollectionPage"),
      },
      {
        path: "podkast",
        children: [
          {
            index: true,
            lazy: () => import("./containers/PodcastPage/PodcastSeriesListPage"),
          },
          {
            path: ":id",
            lazy: () => import("./containers/PodcastPage/PodcastSeriesPage"),
          },
        ],
      },
      {
        path: "article/:articleId",
        lazy: () => import("./containers/PlainArticlePage/PlainArticlePage"),
      },
      {
        path: "learningpaths/:learningpathId",
        children: [
          {
            index: true,
            lazy: () => import("./containers/PlainLearningpathPage/PlainLearningpathPage"),
          },
          {
            path: "steps/:stepId",
            lazy: () => import("./containers/PlainLearningpathPage/PlainLearningpathPage"),
          },
        ],
      },
      {
        path: "r",
        children: [
          {
            path: ":contextId/:stepId?",
            lazy: () => import("./containers/ResourcePage/ResourcePage"),
          },
          {
            path: ":root/:name/:contextId/:stepId?",
            lazy: () => import("./containers/ResourcePage/ResourcePage"),
          },
        ],
      },
      {
        path: "e",
        children: [
          {
            path: ":contextId",
            lazy: () => import("./containers/TopicPage/TopicPage"),
          },
          {
            path: ":root/:name/:contextId",
            lazy: () => import("./containers/TopicPage/TopicPage"),
          },
        ],
      },
      {
        path: "f/:root?/:name?/:contextId",
        lazy: () => import("./containers/SubjectPage/SubjectPage"),
      },
      {
        path: "video/:videoId",
        lazy: () => import("./containers/ResourceEmbed/VideoPage"),
      },
      {
        path: "image/:imageId",
        lazy: () => import("./containers/ResourceEmbed/ImagePage"),
      },
      {
        path: "concept/:conceptId",
        lazy: () => import("./containers/ResourceEmbed/ConceptPage"),
      },
      {
        path: "audio/:audioId",
        lazy: () => import("./containers/ResourceEmbed/AudioPage"),
      },
      {
        path: "h5p/:h5pId",
        lazy: () => import("./containers/ResourceEmbed/H5pPage"),
      },
      {
        path: "minndla",
        lazy: () => import("./containers/MyNdla/MyNdlaLayout"),
        children: [
          {
            index: true,
            lazy: () => import("./containers/MyNdla/MyNdlaPage"),
          },
          {
            path: "folders/:folderId?",
            lazy: () => import("./containers/MyNdla/Folders/FoldersPage"),
          },
          {
            path: "folders/tag/:tag",
            lazy: () => import("./containers/MyNdla/Folders/FoldersTagPage"),
          },
          {
            path: "learningpaths",
            lazy: () => import("./containers/MyNdla/Learningpath/LearningpathCheck"),
            children: [
              {
                index: true,
                lazy: () => import("./containers/MyNdla/Learningpath/LearningpathPage"),
              },
              {
                path: "new",
                lazy: () => import("./containers/MyNdla/Learningpath/NewLearningpathPage"),
              },
              {
                path: ":learningpathId/edit",
                children: [
                  {
                    path: "title",
                    lazy: () => import("./containers/MyNdla/Learningpath/EditLearningpathTitlePage"),
                  },
                  {
                    path: "steps",
                    lazy: () => import("./containers/MyNdla/Learningpath/EditLearningpathStepsPage"),
                    children: [
                      {
                        index: true,
                        lazy: () => import("./containers/MyNdla/Learningpath/components/EditLearningpathNewStepLink"),
                      },
                      {
                        path: "new",
                        lazy: () => import("./containers/MyNdla/Learningpath/components/LearningpathStepForm"),
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
                lazy: () => import("./containers/MyNdla/Learningpath/SaveLearningpathPage"),
              },
              {
                path: ":learningpathId/preview/:stepId?",
                lazy: () => import("./containers/MyNdla/Learningpath/PreviewLearningpathPage"),
              },
            ],
          },
          {
            path: "subjects",
            lazy: () => import("./containers/MyNdla/FavoriteSubjects/FavoriteSubjectsPage"),
          },
          {
            path: "profile",
            lazy: () => import("./containers/MyNdla/MyProfile/MyProfilePage"),
          },
        ],
      },
      {
        path: "om/:slug",
        lazy: () => import("./containers/AboutPageV2/AboutPageV2"),
      },
      {
        path: "folder/:folderId",
        lazy: () => import("./containers/SharedFolderPage/SharedFolderPage"),
      },
      {
        path: "film",
        lazy: () => import("./containers/FilmRedirect/FilmRedirectPage"),
      },
      {
        path: "404",
        lazy: () => import("./containers/NotFoundPage/NotFoundPage"),
      },
      {
        path: "403",
        lazy: () => import("./containers/AccessDeniedPage/AccessDeniedPage"),
      },
      {
        path: "*",
        lazy: () => import("./containers/NotFoundPage/NotFoundPage"),
      },
      {
        path: "p/:articleId",
        lazy: () => import("./containers/PlainArticlePage/PlainArticlePage"),
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
