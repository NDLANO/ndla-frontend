/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export const rr6Routes = [
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
];
