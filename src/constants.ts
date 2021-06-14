/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
export const RESOURCE_TYPE_LEARNING_PATH = 'urn:resourcetype:learningPath';
export const RESOURCE_TYPE_SUBJECT_MATERIAL =
  'urn:resourcetype:subjectMaterial';
export const RESOURCE_TYPE_TASKS_AND_ACTIVITIES =
  'urn:resourcetype:tasksAndActivities';
export const RESOURCE_TYPE_ASSESSMENT_RESOURCES =
  'urn:resourcetype:reviewResource';
export const RESOURCE_TYPE_EXTERNAL_LEARNING_RESOURCES =
  'urn:resourcetype:externalResource';
export const RESOURCE_TYPE_SOURCE_MATERIAL = 'urn:resourcetype:SourceMaterial';

export const RELEVANCE_CORE = 'urn:relevance:core';
export const RELEVANCE_SUPPLEMENTARY = 'urn:relevance:supplementary';

export const NOT_FOUND_PAGE_PATH = '/404';
export const RESOURCE_PAGE_PATH =
  '/(subjects)?/subject\\::subjectId/:topicPath*/:topicId/resource\\::resourceId/:stepId?';
export const PLAIN_ARTICLE_PAGE_PATH = '/article/:articleId';
export const SEARCH_PATH = '/search(.*)';
export const TOPIC_PATH =
  '/(subjects)?/subject\\::subjectId/:topicPath(.*)?/:topicId';
export const SUBJECT_PAGE_PATH = '/subject\\::subjectId/:topicPath*/';
export const SUBJECTS = '/subjects';
export const FILM_PAGE_PATH = '/subject:20';
export const PLAIN_LEARNINGPATH_PAGE_PATH = '/learningpaths/:learningpathId';
export const PLAIN_LEARNINGPATHSTEP_PAGE_PATH =
  '/learningpaths/:learningpathId/steps/:stepId';

export const SKIP_TO_CONTENT_ID = 'SkipToContentId';
export const SUPPORTED_LANGUAGES = ['nb', 'nn', 'en'];
export const STORED_LANGUAGE_KEY = 'language';

export const PROGRAMME_PATH = '/utdanning';
export const PROGRAMME_PAGE_PATH = '/utdanning/:programme';

export const MULTIDISCIPLINARY_SUBJECT_PAGE_PATH =
  '/subject\\::subjectId(d1fe9d0a-a54d-49db-a4c2-fd5463a7c9e7)/:topicPath*/';

export const MULTIDISCIPLINARY_SUBJECT_ARTICLE_PAGE_PATH =
  '/subject\\::subjectId(d1fe9d0a-a54d-49db-a4c2-fd5463a7c9e7)/topic\\::topic1/topic\\::topic2/:topicId';

export const RESOURCE_ARTICLE_IFRAME_PATH = `/article-iframe/:lang?/urn\\:resource\\::resourceId/:articleId`;
export const TOPIC_ARTICLE_IFRAME_PATH = `/article-iframe/:lang?/urn\\::topicId/:articleId`;
export const PLAIN_ARTICLE_IFRAME_PATH = `/article-iframe/:lang?/article/:articleId`;

export const PODCAST_FEED_PATH = `/podcast/:seriesId/feed.xml`;
