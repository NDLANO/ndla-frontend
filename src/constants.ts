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
export const FILM_PAGE_PATH = '/subject:20';
export const UKR_PAGE_PATH = '/subject:27e8623d-c092-4f00-9a6f-066438d6c466';
export const MULTIDISCIPLINARY_SUBJECT_ID =
  'urn:subject:d1fe9d0a-a54d-49db-a4c2-fd5463a7c9e7';
export const TOOLBOX_TEACHER_SUBJECT_ID =
  'urn:subject:1:9bb7b427-3f5b-4c45-9719-efc509f3d9cc';
export const TOOLBOX_STUDENT_SUBJECT_ID =
  'urn:subject:1:54b1727c-2d91-4512-901c-8434e13339b4';

export const SKIP_TO_CONTENT_ID = 'SkipToContentId';
export const SUPPORTED_LANGUAGES = ['nb', 'nn', 'en'];
export const STORED_LANGUAGE_KEY = 'language';

export const PROGRAMME_PATH = '/utdanning';

export const PODCAST_SERIES_PAGE_PATH = '/podkast/:id';
export const PODCAST_SERIES_LIST_PAGE_PATH = '/podkast';
export const TAXONOMY_CUSTOM_FIELD_TOPIC_RESOURCES = 'topic-resources';
export const TAXONOMY_CUSTOM_FIELD_UNGROUPED_RESOURCE = 'ungrouped';
export const TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY = 'subjectCategory';
export const TAXONOMY_CUSTOM_FIELD_SUBJECT_TYPE = 'subjectType';
export const OLD_SUBJECT_PAGE_REDIRECT_CUSTOM_FIELD = 'old-subject-id';

export const LocaleValues = ['nb', 'nn', 'en'] as const;

export const MastheadHeightPx = 84; // See `misc` in @ndla/core for origin
export const EmotionCacheKey = 'ndla-frontend';
