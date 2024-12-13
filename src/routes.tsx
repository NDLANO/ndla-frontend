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
  "minndla/arena",
  "minndla/admin",
  "minndla/admin/flags",
  "minndla/admin/flags/:postId",
  "minndla/admin/users",
  "minndla/arena/category/new",
  "minndla/arena/category/:categoryId",
  "minndla/arena/category/:categoryId/edit",
  "minndla/arena/category/:categoryId/topic/new",
  "minndla/arena/topic/:topicId",
  "minndla/subjects",
  "minndla/arena/notifications",
  "minndla/profile",
  "minndla/arena/user/:username",
  "minndla/learningpaths",
  "minndla/learningpaths/new",
  "minndla/learningpaths/:learningpathId/edit",
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
  "subject:subjectId",
  "subject:subjectId/topic:topicId",
  "subject:subjectId/topic:topicId/resource:resourceId",
  "subject:subjectId/topic:topicId/resource:resourceId/:stepId",
  "subject:subjectId/topic:topic1/topic:topicId",
  "subject:subjectId/topic:topic1/topic:topicId/resource:resourceId",
  "subject:subjectId/topic:topic1/topic:topicId/resource:resourceId/:stepId",
  "subject:subjectId/topic:topic1/topic:topic2/topic:topicId",
  "subject:subjectId/topic:topic1/topic:topic2/topic:topicId/resource:resourceId",
  "subject:subjectId/topic:topic1/topic:topic2/topic:topicId/resource:resourceId/:stepId",
  "subject:subjectId/topic:topic1/topic:topic2/topic:topic3/topic:topicId",
  "subject:subjectId/topic:topic1/topic:topic2/topic:topic3/topic:topicId/resource:resourceId",
  "subject:subjectId/topic:topic1/topic:topic2/topic:topic3/topic:topicId/resource:resourceId/:stepId",
  "subject:subjectId/topic:topic1/topic:topic2/topic:topic3/topic:topic4/topic:topicId/resource:resourceId",
  "subject:subjectId/topic:topic1/topic:topic2/topic:topic3/topic:topic4/topic:topicId/resource:resourceId",
  "subject:subjectId/topic:topic1/topic:topic2/topic:topic3/topic:topic4/topic:topicId/resource:resourceId/:stepId",
  "collection/:collectionId",
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
  "article-iframe/urn:topicOrResourceId/:articleId",
  "article-iframe/:lang/urn:topicOrResourceId/:articleId",
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
  "subjects/subject:subjectId/topic:topicId",
  "subjects/subject:subjectId/topic:topicId/resource:resourceId",
  "subjects/subject:subjectId/topic:topicId/resource:resourceId/:stepId",
  "subjects/subject:subjectId/topic:topic1/topic:topicId",
  "subjects/subject:subjectId/topic:topic1/topic:topicId/resource:resourceId",
  "subjects/subject:subjectId/topic:topic1/topic:topicId/resource:resourceId/:stepId",
  "subjects/subject:subjectId/topic:topic1/topic:topic2/topic:topicId",
  "subjects/subject:subjectId/topic:topic1/topic:topic2/topic:topicId/resource:resourceId",
  "subjects/subject:subjectId/topic:topic1/topic:topic2/topic:topicId/resource:resourceId/:stepId",
  "subjects/subject:subjectId/topic:topic1/topic:topic2/topic:topic:3/topic:topicId",
  "subjects/subject:subjectId/topic:topic1/topic:topic2/topic:topic:3/topic:topicId/resource:resourceId",
  "subjects/subject:subjectId/topic:topic1/topic:topic2/topic:topic:3/topic:topicId/resource:resourceId/:stepId",
  "subjects/subject:subjectId/topic:topic1/topic:topic2/topic:topic:3/topic:topic4/topic:topicId",
  "subjects/subject:subjectId/topic:topic1/topic:topic2/topic:topic:3/topic:topic4/topic:topicId/resource:resourceId",
  "subjects/subject:subjectId/topic:topic1/topic:topic2/topic:topic:3/topic:topic4/topic:topicId/resource:resourceId/:stepId",
  "subject:subjectId/topic:topicId",
  "subject:subjectId/topic:topicId/resource:resourceId",
  "subject:subjectId/topic:topicId/resource:resourceId/:stepId",
  "subject:subjectId/topic:topic1/topic:topicId",
  "subject:subjectId/topic:topic1/topic:topicId/resource:resourceId",
  "subject:subjectId/topic:topic1/topic:topicId/resource:resourceId/:stepId",
  "subject:subjectId/topic:topic1/topic:topic2/topic:topicId",
  "subject:subjectId/topic:topic1/topic:topic2/topic:topicId/resource:resourceId",
  "subject:subjectId/topic:topic1/topic:topic2/topic:topicId/resource:resourceId/:stepId",
  "subject:subjectId/topic:topic1/topic:topic2/topic:topic3/topic:topicId",
  "subject:subjectId/topic:topic1/topic:topic2/topic:topic3/topic:topicId/resource:resourceId",
  "subject:subjectId/topic:topic1/topic:topic2/topic:topic3/topic:topicId/resource:resourceId/:stepId",
  "subject:subjectId/topic:topic1/topic:topic2/topic:topic3/topic:topic4/topic:topicId",
  "subject:subjectId/topic:topic1/topic:topic2/topic:topic3/topic:topic4/topic:topicId/resource:resourceId",
  "subject:subjectId/topic:topic1/topic:topic2/topic:topic3/topic:topic4/topic:topicId/resource:resourceId/:stepId",
  "f/:contextId",
  "f/:name/:contextId",
  "f/:root/:name/:contextId",
  "e/:contextId",
  "e/:root/:name/:contextId",
  "r/:contextId",
  "r/:contextId/:stepId",
  "r/:root/:name/:contextId",
  "r/:root/:name/:contextId/:stepId",
  "article/:articleId",
  "video/:videoId",
  "image/:imageId",
  "concept/:conceptId",
  "audio/:audioId",
  "h5p/:h5pId",
  ...embedRoutes,
];
