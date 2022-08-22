/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export const privateRoutes = [
  'profile',
  'profile/meny',
  'profile/folders',
  'profile/tags',
  'profile/tags/:tag',
  'profile/folders/:folderId',
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
  'logout',
  'logout/session',
  'podkast',
  'podkast/:id',
  'article/:articleId',
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
  'subject:subjectId/topic:topicId',
  'subject:subjectId/topic:topicId/resource:resourceId',
  'subject:subjectId/topic:topicId/resource:resourceId/:stepId',
  'subject:subjectId/topic:topic1/topic:topicId',
  'subject:subjectId/topic:topic1/topic:topicId/resource:resourceId',
  'subject:subjectId/topic:topic1/topic:topicId/resource:resourceId/:stepid',
  'subject:subjectId/topic:topic1/topic:topic2/topic:topicId',
  'subject:subjectId/topic:topic1/topic:topic2/topic:topicId/resource:resourceId',
  'subject:subjectId/topic:topic1/topic:topic2/topic:topicId/resource:resourceId/:stepId',
  'article/:articleId',
  'article-iframe/article/:articleId',
  'article-iframe/:lang/article/:articleId',
  'article-iframe/urn:topicOrResourceId/:articleId',
  'article-iframe/:lang/urn:topicOrResourceId/:articleId',
];
