/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { RouteObject } from "react-router";
import { ErrorPage } from "./containers/ErrorPage/ErrorPage";
import { Layout } from "./containers/Page/Layout";
import { RouteObjectWithImportPath } from "./interfaces";
import { ErrorElement } from "./RouteErrorElement";

export const routes: RouteObjectWithImportPath[] = [
  {
    path: "/",
    errorElement: <ErrorElement />,
    element: <Layout />,
    children: [
      {
        index: true,
        importPath: "src/containers/WelcomePage/WelcomePage.tsx",
        lazy: () => import("./containers/WelcomePage/WelcomePage"),
      },
      {
        path: "subjects",
        importPath: "src/containers/AllSubjectsPage/AllSubjectsPage.tsx",
        lazy: () => import("./containers/AllSubjectsPage/AllSubjectsPage"),
      },
      {
        path: "search",
        importPath: "src/containers/SearchPage/SearchPage.tsx",
        lazy: () => import("./containers/SearchPage/SearchPage"),
      },
      {
        path: "utdanning/:programme/:contextId/:grade?",
        importPath: "src/containers/ProgrammePage/ProgrammePage.tsx",
        lazy: () => import("./containers/ProgrammePage/ProgrammePage"),
      },
      {
        path: "samling/:collectionId",
        importPath: "src/containers/CollectionPage/CollectionPage.tsx",
        lazy: () => import("./containers/CollectionPage/CollectionPage"),
      },
      {
        path: "podkast",
        children: [
          {
            index: true,
            importPath: "src/containers/PodcastPage/PodcastSeriesListPage.tsx",
            lazy: () => import("./containers/PodcastPage/PodcastSeriesListPage"),
          },
          {
            path: ":id",
            importPath: "src/containers/PodcastPage/PodcastSeriesPage.tsx",
            lazy: () => import("./containers/PodcastPage/PodcastSeriesPage"),
          },
        ],
      },
      {
        path: "article/:articleId",
        importPath: "src/containers/PlainArticlePage/PlainArticlePage.tsx",
        lazy: () => import("./containers/PlainArticlePage/PlainArticlePage"),
      },
      {
        path: "learningpaths/:learningpathId",
        children: [
          {
            index: true,
            importPath: "src/containers/PlainLearningpathPage/PlainLearningpathPage.tsx",
            lazy: () => import("./containers/PlainLearningpathPage/PlainLearningpathPage"),
          },
          {
            path: "steps/:stepId",
            importPath: "src/containers/PlainLearningpathPage/PlainLearningpathPage.tsx",
            lazy: () => import("./containers/PlainLearningpathPage/PlainLearningpathPage"),
          },
        ],
      },
      {
        path: "r",
        children: [
          {
            path: ":contextId/:stepId?",
            importPath: "src/containers/ResourcePage/ResourcePage.tsx",
            lazy: () => import("./containers/ResourcePage/ResourcePage"),
          },
          {
            path: ":root/:name/:contextId/:stepId?",
            importPath: "src/containers/ResourcePage/ResourcePage.tsx",
            lazy: () => import("./containers/ResourcePage/ResourcePage"),
          },
        ],
      },
      {
        path: "e",
        children: [
          {
            path: ":contextId",
            importPath: "src/containers/TopicPage/TopicPage.tsx",
            lazy: () => import("./containers/TopicPage/TopicPage"),
          },
          {
            path: ":root/:name/:contextId",
            importPath: "src/containers/TopicPage/TopicPage.tsx",
            lazy: () => import("./containers/TopicPage/TopicPage"),
          },
        ],
      },
      {
        path: "f/:root?/:name?/:contextId",
        importPath: "src/containers/SubjectPage/SubjectPage.tsx",
        lazy: () => import("./containers/SubjectPage/SubjectPage"),
      },
      {
        path: "video/:videoId",
        importPath: "src/containers/ResourceEmbed/VideoPage.tsx",
        lazy: () => import("./containers/ResourceEmbed/VideoPage"),
      },
      {
        path: "image/:imageId",
        importPath: "src/containers/ResourceEmbed/ImagePage.tsx",
        lazy: () => import("./containers/ResourceEmbed/ImagePage"),
      },
      {
        path: "concept/:conceptId",
        importPath: "src/containers/ResourceEmbed/ConceptPage.tsx",
        lazy: () => import("./containers/ResourceEmbed/ConceptPage"),
      },
      {
        path: "audio/:audioId",
        importPath: "src/containers/ResourceEmbed/AudioPage.tsx",
        lazy: () => import("./containers/ResourceEmbed/AudioPage"),
      },
      {
        path: "h5p/:h5pId",
        importPath: "src/containers/ResourceEmbed/H5pPage.tsx",
        lazy: () => import("./containers/ResourceEmbed/H5pPage"),
      },
      {
        path: "minndla",
        importPath: "src/containers/MyNdla/MyNdlaLayout.tsx",
        lazy: () => import("./containers/MyNdla/MyNdlaLayout"),
        children: [
          {
            index: true,
            importPath: "src/containers/MyNdla/MyNdlaPage.tsx",
            lazy: () => import("./containers/MyNdla/MyNdlaPage"),
          },
          {
            path: "folders",
            children: [
              {
                index: true,
                importPath: "src/containers/MyNdla/Folders/RootFoldersPage.tsx",
                lazy: () => import("./containers/MyNdla/Folders/RootFoldersPage"),
              },
              {
                path: ":folderId",
                importPath: "src/containers/MyNdla/Folders/SubFolderPage.tsx",
                lazy: () => import("./containers/MyNdla/Folders/SubFolderPage"),
              },
            ],
          },
          {
            path: "learningpaths",
            importPath: "src/containers/MyNdla/Learningpath/LearningpathCheck.tsx",
            lazy: () => import("./containers/MyNdla/Learningpath/LearningpathCheck"),
            children: [
              {
                index: true,
                importPath: "src/containers/MyNdla/Learningpath/LearningpathPage.tsx",
                lazy: () => import("./containers/MyNdla/Learningpath/LearningpathPage"),
              },
              {
                path: "new",
                importPath: "src/containers/MyNdla/Learningpath/NewLearningpathPage.tsx",
                lazy: () => import("./containers/MyNdla/Learningpath/NewLearningpathPage"),
              },
              {
                path: ":learningpathId/edit",
                children: [
                  {
                    path: "title",
                    importPath: "src/containers/MyNdla/Learningpath/EditLearningpathTitlePage.tsx",
                    lazy: () => import("./containers/MyNdla/Learningpath/EditLearningpathTitlePage"),
                  },
                  {
                    path: "steps",
                    importPath: "src/containers/MyNdla/Learningpath/EditLearningpathStepsPage.tsx",
                    lazy: () => import("./containers/MyNdla/Learningpath/EditLearningpathStepsPage"),
                    children: [
                      {
                        index: true,
                        importPath: "src/containers/MyNdla/Learningpath/components/EditLearningpathNewStepLink.tsx",
                        lazy: () => import("./containers/MyNdla/Learningpath/components/EditLearningpathNewStepLink"),
                      },
                      {
                        path: "new",
                        importPath: "src/containers/MyNdla/Learningpath/components/LearningpathStepForm.tsx",
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
                importPath: "src/containers/MyNdla/Learningpath/SaveLearningpathPage.tsx",
                lazy: () => import("./containers/MyNdla/Learningpath/SaveLearningpathPage"),
              },
              {
                path: ":learningpathId/preview/:stepId?",
                importPath: "src/containers/MyNdla/Learningpath/PreviewLearningpathPage.tsx",
                lazy: () => import("./containers/MyNdla/Learningpath/PreviewLearningpathPage"),
              },
            ],
          },
          {
            path: "subjects",
            importPath: "src/containers/MyNdla/FavoriteSubjects/FavoriteSubjectsPage.tsx",
            lazy: () => import("./containers/MyNdla/FavoriteSubjects/FavoriteSubjectsPage"),
          },
          {
            path: "profile",
            importPath: "src/containers/MyNdla/MyProfile/MyProfilePage.tsx",
            lazy: () => import("./containers/MyNdla/MyProfile/MyProfilePage"),
          },
        ],
      },
      {
        path: "om/:slug",
        importPath: "src/containers/AboutPageV2/AboutPageV2.tsx",
        lazy: () => import("./containers/AboutPageV2/AboutPageV2"),
      },
      {
        path: "folder/:folderId",
        importPath: "src/containers/SharedFolderPage/SharedFolderPage.tsx",
        lazy: () => import("./containers/SharedFolderPage/SharedFolderPage"),
      },
      {
        path: "film",
        importPath: "src/containers/FilmRedirect/FilmRedirectPage.tsx",
        lazy: () => import("./containers/FilmRedirect/FilmRedirectPage"),
      },
      {
        path: "404",
        importPath: "src/containers/NotFoundPage/NotFoundPage.tsx",
        lazy: () => import("./containers/NotFoundPage/NotFoundPage"),
      },
      {
        path: "403",
        importPath: "src/containers/AccessDeniedPage/AccessDeniedPage.tsx",
        lazy: () => import("./containers/AccessDeniedPage/AccessDeniedPage"),
      },
      {
        path: "*",
        importPath: "src/containers/NotFoundPage/NotFoundPage.tsx",
        lazy: () => import("./containers/NotFoundPage/NotFoundPage"),
      },
      {
        path: "p/:articleId",
        importPath: "src/containers/PlainArticlePage/PlainArticlePage.tsx",
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
