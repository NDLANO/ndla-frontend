/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export const privateRoutes = [
  'minndla',
  'minndla/folders',
  'minndla/tags',
  'minndla/tags/:tag',
  'minndla/folders/:folderId',
  'minndla/subjects',
  'minndla/profile',
  'minndla/user/:username',
];

export const routes = [
  '/',
  '404',
  '403',
  'search',
  'utdanning',
  'utdanning/:programme',
  'utdanning/:programme/:grade',
  'subjects',
  'login',
  'login/success',
  'login/failure',
  'podkast',
  'podkast/:id',
  'video/:videoId',
  'image/:imageId',
  'audio/:audioId',
  'concept/:conceptId',
  'h5p/:h5pId',
  'article/:articleId',
  'folder/:folderId',
  'folder/:folderId/:subFolderId/:resourceId',
  'folder/:folderId/:subFolderId',
  'p/:articleId',
  'about/:slug',
  'learningpaths/:learningpathId',
  'learningpaths/:learningpathId/:stepId',
  'subject:subjectId',
  'subject:subjectId/topic:topicId',
  'subject:subjectId/topic:topicId/resource:resourceId',
  'subject:subjectId/topic:topicId/resource:resourceId/:stepId',
  'subject:subjectId/topic:topic1/topic:topicId',
  'subject:subjectId/topic:topic1/topic:topicId/resource:resourceId',
  'subject:subjectId/topic:topic1/topic:topicId/resource:resourceId/:stepid',
  'subject:subjectId/topic:topic1/topic:topic2/topic:topicId',
  'subject:subjectId/topic:topic1/topic:topic2/topic:topicId/resource:resourceId',
  'subject:subjectId/topic:topic1/topic:topic2/topic:topicId/resource:resourceId/:stepId',
  'subject:subjectId/topic:topic1/topic:topic2/topic:topic3/topic:topicId',
  'subject:subjectId/topic:topic1/topic:topic2/topic:topic3/topic:topicId/resource:resourceId',
  'subject:subjectId/topic:topic1/topic:topic2/topic:topic3/topic:topicId/resource:resourceId/:stepId',
  'subject:subjectId/topic:topic1/topic:topic2/topic:topic3/topic:topic4/topic:topicId/resource:resourceId',
  'subject:subjectId/topic:topic1/topic:topic2/topic:topic3/topic:topic4/topic:topicId/resource:resourceId',
  'subject:subjectId/topic:topic1/topic:topic2/topic:topic3/topic:topic4/topic:topicId/resource:resourceId/:stepId',
  ...privateRoutes,
];

export const oembedRoutes = [
  'subjects/subject:subjectId/topic:topicId',
  'subjects/subject:subjectId/topic:topicId/resource:resourceId',
  'subjects/subject:subjectId/topic:topicId/resource:resourceId/:stepId',
  'subjects/subject:subjectId/topic:topic1/topic:topicId',
  'subjects/subject:subjectId/topic:topic1/topic:topicId/resource:resourceId',
  'subjects/subject:subjectId/topic:topic1/topic:topicId/resource:resourceId/:stepid',
  'subjects/subject:subjectId/topic:topic1/topic:topic2/topic:topicId',
  'subjects/subject:subjectId/topic:topic1/topic:topic2/topic:topicId/resource:resourceId',
  'subjects/subject:subjectId/topic:topic1/topic:topic2/topic:topicId/resource:resourceId/:stepId',
  'subjects/subject:subjectId/topic:topic1/topic:topic2/topic:topic:3/topic:topicId',
  'subjects/subject:subjectId/topic:topic1/topic:topic2/topic:topic:3/topic:topicId/resource:resourceId',
  'subjects/subject:subjectId/topic:topic1/topic:topic2/topic:topic:3/topic:topicId/resource:resourceId/:stepId',
  'subjects/subject:subjectId/topic:topic1/topic:topic2/topic:topic:3/topic:topic4/topic:topicId',
  'subjects/subject:subjectId/topic:topic1/topic:topic2/topic:topic:3/topic:topic4/topic:topicId/resource:resourceId',
  'subjects/subject:subjectId/topic:topic1/topic:topic2/topic:topic:3/topic:topic4/topic:topicId/resource:resourceId/:stepId',
  'subject:subjectId/topic:topicId',
  'subject:subjectId/topic:topicId/resource:resourceId',
  'subject:subjectId/topic:topicId/resource:resourceId/:stepId',
  'subject:subjectId/topic:topic1/topic:topicId',
  'subject:subjectId/topic:topic1/topic:topicId/resource:resourceId',
  'subject:subjectId/topic:topic1/topic:topicId/resource:resourceId/:stepid',
  'subject:subjectId/topic:topic1/topic:topic2/topic:topicId',
  'subject:subjectId/topic:topic1/topic:topic2/topic:topicId/resource:resourceId',
  'subject:subjectId/topic:topic1/topic:topic2/topic:topicId/resource:resourceId/:stepId',
  'subject:subjectId/topic:topic1/topic:topic2/topic:topic3/topic:topicId',
  'subject:subjectId/topic:topic1/topic:topic2/topic:topic3/topic:topicId/resource:resourceId',
  'subject:subjectId/topic:topic1/topic:topic2/topic:topic3/topic:topicId/resource:resourceId/:stepId',
  'subject:subjectId/topic:topic1/topic:topic2/topic:topic3/topic:topic4/topic:topicId',
  'subject:subjectId/topic:topic1/topic:topic2/topic:topic3/topic:topic4/topic:topicId/resource:resourceId',
  'subject:subjectId/topic:topic1/topic:topic2/topic:topic3/topic:topic4/topic:topicId/resource:resourceId/:stepId',
  'article/:articleId',
  'article-iframe/article/:articleId',
  'article-iframe/:lang/article/:articleId',
  'article-iframe/urn:topicOrResourceId/:articleId',
  'article-iframe/:lang/urn:topicOrResourceId/:articleId',
  'video/:videoId',
  'image/:imageId',
  'concept/:conceptId',
  'audio/:audioId',
  'h5p/:h5pId',
  'embed-iframe/video/:videoId',
  'embed-iframe/audio/:audioId',
  'embed-iframe/image/:imageId',
  'embed-iframe/concept/:conceptId',
  'embed-iframe/h5p/:h5pId',
  'embed-iframe/:lang/video/:videoId',
  'embed-iframe/:lang/audio/:audioId',
  'embed-iframe/:lang/image/:imageId',
  'embed-iframe/:lang/concept/:conceptId',
  'embed-iframe/:lang/h5p/:h5pId',
];
