/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/// <reference types="vite/client" />

interface ImportMetaEnv {
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
