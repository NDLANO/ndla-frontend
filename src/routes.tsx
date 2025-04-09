/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export const privateRoutes = [
  "minndla/folders",
  "minndla/folders/preview/:folderId",
  "minndla/folders/preview/:folderId/:subFolderId",
  "minndla/folders/preview/:folderId/:subFolderId/:resourceId",
  "minndla/folders/:folderId",
  "minndla/folders/tag/:tag",
  "minndla/subjects",
  "minndla/profile",
  "minndla/learningpaths",
  "minndla/learningpaths/new",
  "minndla/learningpaths/:learningpathId/edit/title",
  "minndla/learningpaths/:learningpathId/edit/steps",
  "minndla/learningpaths/:learningpathId/preview",
  "minndla/learningpaths/:learningpathId/save",
];

export const routes = [
  "/",
  "404",
  "403",
  "search",
  "utdanning",
  "utdanning/:programme",
  "utdanning/:programme/:contextId",
  "utdanning/:programme/:contextId/:grade",
  "subjects",
  "login",
  "login/success",
  "login/failure",
  "podkast",
  "podkast/:id",
  "video/:videoId",
  "image/:imageId",
  "audio/:audioId",
  "concept/:conceptId",
  "h5p/:h5pId",
  "article/:articleId",
  "folder/:folderId",
  "folder/:folderId/:subFolderId/:resourceId",
  "folder/:folderId/:subFolderId",
  "p/:articleId",
  "about/:slug",
  "om/:slug",
  "learningpaths/:learningpathId",
  "learningpaths/:learningpathId/:stepId",
  "samling/:collectionId",
  "f/:contextId",
  "f/:name/:contextId",
  "f/:root/:name/:contextId",
  "e/:contextId",
  "e/:root/:name/:contextId",
  "r/:contextId",
  "r/:contextId/:stepId",
  "r/:root/:name/:contextId",
  "r/:root/:name/:contextId/:stepId",
  "minndla",
  ...privateRoutes,
];

export const embedRoutes = [
  "article-iframe/article/:articleId",
  "article-iframe/:lang/article/:articleId",
  "article-iframe/:nodeId/:articleId",
  "article-iframe/:lang/:nodeId/:articleId",
  "embed-iframe/video/:videoId",
  "embed-iframe/audio/:audioId",
  "embed-iframe/image/:imageId",
  "embed-iframe/concept/:conceptId",
  "embed-iframe/h5p/:h5pId",
  "embed-iframe/:lang/video/:videoId",
  "embed-iframe/:lang/audio/:audioId",
  "embed-iframe/:lang/image/:imageId",
  "embed-iframe/:lang/concept/:conceptId",
  "embed-iframe/:lang/h5p/:h5pId",
];

export const oembedRoutes = [
  "subject:subjectId/topic:topicId",
  "subject:subjectId/topic:topicId/resource:resourceId",
  "subject:subjectId/topic:topic1/topic:topicId",
  "subject:subjectId/topic:topic1/topic:topicId/resource:resourceId",
  "subject:subjectId/topic:topic1/topic:topic2/topic:topicId",
  "subject:subjectId/topic:topic1/topic:topic2/topic:topicId/resource:resourceId",
  "subject:subjectId/topic:topic1/topic:topic2/topic:topic3/topic:topicId",
  "subject:subjectId/topic:topic1/topic:topic2/topic:topic3/topic:topicId/resource:resourceId",
  "subject:subjectId/topic:topic1/topic:topic2/topic:topic3/topic:topic4/topic:topicId",
  "subject:subjectId/topic:topic1/topic:topic2/topic:topic3/topic:topic4/topic:topicId/resource:resourceId",
  "e/:contextId",
  "e/:root/:name/:contextId",
  "r/:contextId",
  "r/:root/:name/:contextId",
  "article/:articleId",
  "video/:videoId",
  "image/:imageId",
  "concept/:conceptId",
  "audio/:audioId",
  "h5p/:h5pId",
  ...embedRoutes,
];
