/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  resolveJsonOrRejectWithError,
  apiResourceUrl,
  fetch,
} from './apiHelpers';

const baseUrl = apiResourceUrl('/audio-api/v1/series');

interface Author {
  type: string;
  name: string;
}

interface AudioMetaInformation {
  id: number;
  revision: number;
  title: { title: string; language: string };
  audioFile: {
    url: string;
    mimeType: string;
    fileSize: number;
    language: string;
  };
  copyright: {
    license: {
      license: string;
      description?: string;
      url?: string;
    };
    origin?: string;
    creators: Author[];
    rightsholders: Author[];
    processors: Author[];
    agreementId?: number;
    validFrom?: string;
    validTo?: string;
  };
  tags: {
    tags: string[];
    language: string;
  };
  supportedLanguages: string[];
  audioType: string;
  podcastMeta?: {
    introduction: string;
    coverPhoto: {
      id: string;
      url: string;
      altText: string;
    };
    language: string;
  };
  manuscript?: { manuscript: string; language: string };
  updated: string;
  created: string;
}

interface Series {
  id: number;
  revision: number;
  title: { title: string; language: string };
  description: { description: string; language: string };
  coverPhoto: {
    id: string;
    url: string;
    altText: string;
  };
  episodes: AudioMetaInformation[];
  supportedLanguages: string[];
}

export const fetchSeries = (id: number, locale: string): Promise<Series> =>
  fetch(`${baseUrl}/${id}?language=${locale}`).then(
    resolveJsonOrRejectWithError,
  );
