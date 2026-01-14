/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export const NDLAFILM_RESOURCE_TYPE_DOCUMENTARY = "urn:resourcetype:documentary";
export const NDLAFILM_RESOURCE_TYPE_FEATURE_FILM = "urn:resourcetype:featureFilm";
export const NDLAFILM_RESOURCE_TYPE_SERIES = "urn:resourcetype:series";
export const NDLAFILM_RESOURCE_TYPE_SHORT_FILM = "urn:resourcetype:shortFilm";
export const RESOURCE_TYPE_ASSESSMENT_RESOURCES = "urn:resourcetype:reviewResource";
export const RESOURCE_TYPE_CONCEPT = "urn:resourcetype:concept";
export const RESOURCE_TYPE_GAME = "urn:resourcetype:game";
export const RESOURCE_TYPE_SOURCE_MATERIAL = "urn:resourcetype:SourceMaterial";
export const RESOURCE_TYPE_SUBJECT_MATERIAL = "urn:resourcetype:subjectMaterial";
export const RESOURCE_TYPE_TASKS_AND_ACTIVITIES = "urn:resourcetype:tasksAndActivities";

export const learningPathResourceTypes = [
  RESOURCE_TYPE_ASSESSMENT_RESOURCES,
  RESOURCE_TYPE_CONCEPT,
  RESOURCE_TYPE_GAME,
  RESOURCE_TYPE_SOURCE_MATERIAL,
  RESOURCE_TYPE_SUBJECT_MATERIAL,
  RESOURCE_TYPE_TASKS_AND_ACTIVITIES,
];

export const FEIDE_ACCESS_TOKEN_COOKIE = "feide_access_token";
export const FEIDE_ID_TOKEN_COOKIE = "feide_id_token";
export const NONCE_COOKIE = "ndla_nonce";
export const STATE_COOKIE = "ndla_auth_state";
export const AUTHENTICATED_COOKIE = "ndla_authenticated";
export const PKCE_CODE_COOKIE = "ndla_PKCE_code";
export const RETURN_TO_COOKIE = "ndla_return_to";
export const SESSION_EXPIRY_COOKIE = "ndla_session_expires_at";
export const NODEBB_AUTH_COOKIE = "nodebb_auth";

export const RELEVANCE_CORE = "urn:relevance:core";
export const RELEVANCE_SUPPLEMENTARY = "urn:relevance:supplementary";

export const NOT_FOUND_PAGE_PATH = "/404";
export const FILM_ID = "urn:subject:20";
export const MULTIDISCIPLINARY_SUBJECT_ID = "urn:subject:d1fe9d0a-a54d-49db-a4c2-fd5463a7c9e7";
export const TOOLBOX_TEACHER_SUBJECT_ID = "urn:subject:1:9bb7b427-3f5b-4c45-9719-efc509f3d9cc";
export const TOOLBOX_STUDENT_SUBJECT_ID = "urn:subject:1:54b1727c-2d91-4512-901c-8434e13339b4";

export const FILM_PAGE_URL = "/f/ndla-film/24d0e0db3c02";
export const MULTIDISCIPLINARY_URL = "/f/tverrfaglige-temaer/daaf4e2dd8b0";
export const TOOLBOX_TEACHER_URL = "/f/verktoykassa---for-larere/c697e0278768";
export const TOOLBOX_STUDENT_URL = "/f/verktoykassa---for-elever/107af8b8e7d2";
export const UKR_PAGE_URL = "/f/ukrainian-resources-in-norwegian-social-science/1022072a8411";

export const SKIP_TO_CONTENT_ID = "SkipToContentId";
export const SUPPORTED_LANGUAGES = ["nb", "nn", "en", "se"];

export const PROGRAMME_PATH = "/utdanning";
export const ABOUT_PATH = "/om";

export const PODCAST_SERIES_PAGE_PATH = "/podkast/:id";
export const PODCAST_SERIES_LIST_PAGE_PATH = "/podkast";
export const TAXONOMY_CUSTOM_FIELD_TOPIC_RESOURCES = "topic-resources";
export const TAXONOMY_CUSTOM_FIELD_UNGROUPED_RESOURCE = "ungrouped";
export const TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY = "subjectCategory";
export const TAXONOMY_CUSTOM_FIELD_SUBJECT_TYPE = "subjectType";
export const TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT = "forklaringsfag";
export const OLD_SUBJECT_PAGE_REDIRECT_CUSTOM_FIELD = "old-subject-id";

export const COLLECTION_LANGUAGES = ["nb", "nn", "en", "se", "sma", "ukr"];

export const LocaleValues = ["nb", "nn", "en", "se"] as const;

export const AcquireLicensePage =
  "https://support.ndla.no/hc/no/articles/360000945552-Bruk-av-lisenser-og-lisensiering";

export const MY_NDLA_CONTENT_WIDTH = 1440;
export const AUTOLOGIN_COOKIE = "autologin";

export const programmeRedirects: Record<string, string> = {
  "bygg-og-anleggsteknikk": "847f59182173",
  "elektro-og-datateknologi": "55ad4a85ba78",
  "frisor-blomster-interior-og-eksponeringsdesign": "235c13273508",
  "handverk-design-og-produktutvikling": "28899b73c188",
  "helse-og-oppvekstfag": "5ad439a5dacb",
  idrettsfag: "dd37b407714d",
  "informasjonsteknologi-og-medieproduksjon": "23f18a24131e",
  "kunst-design-og-arkitektur": "72376dcfd25a",
  "medier-og-kommunikasjon": "57b0e8cd7270",
  "musikk-dans-og-drama": "338394ba465c",
  naturbruk: "d23305736cde",
  pabygg: "6ea1ed34e5e7",
  "restaurant-og-matfag": "0a0cd4e39743",
  "salg-service-og-reiseliv": "b55100bbc29e",
  studiespesialisering: "7d5badf01ff2",
  "teknologi-og-industrifag": "a920d0b5cbbb",
};

export const validContextIdRegExp = new RegExp(/^[a-f0-9]{10,12}/);
