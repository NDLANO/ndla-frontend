/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */
import { NormalizedCacheObject } from '@apollo/client';
import { BreadcrumbItemProps } from '@ndla/ui/lib/Breadcrumblist/Breadcrumblist';
import { History } from 'history';
import { ConfigType } from './config';
import { LocaleValues } from './constants';

export type InitialProps = {
  loading?: boolean;
  resCookie?: string;
  basename?: string;
  locale?: LocaleType;
};

export interface WindowData {
  apolloState: NormalizedCacheObject;
  config: ConfigType;
  initialProps: InitialProps;
  ltiData?: LtiData;
  serverPath?: string;
  serverQuery?: {
    [key: string]: string | number | boolean | undefined | null;
  };
}

export interface NDLAWindow {
  DATA: WindowData;
  errorReporter: any;
  hasHydrated?: boolean;
  browserHistory: History;
}

export type LocaleType = typeof LocaleValues[number];

export type BreadcrumbItem = BreadcrumbItemProps & { index?: number };

export type Breadcrumb = { to: string; name: string };

export type ResourceType = 'image' | 'other' | 'video';

export type CompetenceGoalsType = 'LK06' | 'LK20';

interface ProgrammeMeta {
  description: Partial<Record<LocaleType, string>>;
}
export interface ProgrammeType {
  name: Record<LocaleType, string>;
  url: Record<LocaleType, string>;
  meta?: ProgrammeMeta;
  image: { url: string };
  grades: ProgrammeGrade[];
}

export interface ProgrammeGrade {
  name: string;
  categories: GradeCategory[];
}

export interface GradeCategory {
  name?: Partial<Record<LocaleType, string>>;
  subjects: { id: string }[];
}

export type SubjectType = {
  longName?: Record<LocaleType, string>;
  name?: Record<LocaleType, string>;
  id: string;
  topicId?: string;
};

export type LtiData = {
  content_item_return_url?: string;
  launch_presentation_return_url?: string;
  launch_presentation_document_target?: string;
  launch_presentation_width?: string;
  launch_presentation_height?: string;
  ext_content_return_types?: string;
  lti_message_type?: string;
  oauth_callback?: string;
  oauth_consumer_key?: string;
  oauth_signature?: string;
  oauth_signature_method?: string;
  oauth_timestamp?: string;
  oauth_version?: string;
  oauth_nonce?: string;
  data?: string;
};

export type LtiItem = {
  id: number;
  title: string;
  url: string | { href?: string };
};
