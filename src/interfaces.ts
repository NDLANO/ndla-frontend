/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

interface CoverPhoto {
  id: string;
  url: string;
  altText: string;
}

export interface Audio {
  audioFile: {
    filesize: number;
    language: string;
    mimeType: string;
    url: string;
  };
  caption: string;
  copyright: Copyright;
  id: number;
  revision: number;
  supportedLanguages: string[];
  tags: {
    language: string;
    tags: string[];
  };
  title: string;
  podcastMeta?: {
    header: string;
    introduction: string;
    coverPhoto: CoverPhoto;
    manuscript: string;
    language: string;
  };
}

export interface Location {
  pathname: string;
  search?: string;
}

export interface License {
  license: string;
  description: string;
  url?: string;
}

export interface Author {
  name: string;
  type: string;
}

export interface Copyright {
  license?: License;
  origin?: string;
  creators: Author[];
  processors: Author[];
  rightsholders: Author[];
  agreementId?: number;
  validFrom?: string;
  validTo?: string;
}
