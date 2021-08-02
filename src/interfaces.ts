/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */
<<<<<<< HEAD
import { NormalizedCacheObject } from '@apollo/client';
=======
import { BreadcrumbItemProps } from '@ndla/ui/lib/Breadcrumblist/Breadcrumblist';
>>>>>>> 48727351d8c2b1528121919918702377ade879ab
import { History } from 'history';
import { ConfigType } from './config';
import { LocaleValues } from './constants';

export type InitialProps = {
  loading?: boolean;
  basename: string;
};

export interface WindowData {
  apolloState: NormalizedCacheObject;
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
