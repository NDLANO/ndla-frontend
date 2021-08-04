/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */
import { BreadcrumbItemProps } from '@ndla/ui/lib/Breadcrumblist/Breadcrumblist';
import { History } from 'history';
import { ConfigType } from './config';
import { LocaleValues } from './constants';

export type InitialProps = {
  loading?: boolean;
  basename: string;
};

export interface WindowData {
  config: ConfigType;
  initialProps: InitialProps;
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

type LocaleNorway = Extract<LocaleType, 'nb' | 'nn'>;
interface ProgramTypeBase {
  name: Record<LocaleType, string>;
  url: Record<LocaleType, string>;
  meta: { description: Record<LocaleNorway, string> };
  image: { url: string };
  grades: {
    name: string;
    categories: (
      | { name: null; subjects: { id: string }[] }
      | { name: Record<LocaleType, string>; subjects: { id: string }[] }
    )[];
  }[];
}
export interface ProgramType extends Omit<ProgramTypeBase, 'meta'> {
  meta?: { description: Record<LocaleNorway, string> };
}

export type SubjectType = {
  longName?: Record<LocaleType, string>;
  name?: Record<LocaleType, string>;
  id: string;
  topicId?: string;
};
