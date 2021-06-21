/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */
import { History } from 'history';
import { ConfigType } from './config';

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

export interface TopicShape {}

export const TopicShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  path: PropTypes.string,
  article: ArticleShape,
  coreResources: PropTypes.arrayOf(ResourceShape),
  supplementaryResources: PropTypes.arrayOf(ResourceShape),
  subtopics: PropTypes.array,
});
