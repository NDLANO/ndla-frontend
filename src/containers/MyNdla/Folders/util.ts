/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import config from "../../../config";

export const sharedFolderLink = (id: string) => `${config.ndlaFrontendDomain}/folder/${id}`;

export const copyFolderSharingLink = (id: string) => window.navigator.clipboard.writeText(sharedFolderLink(id));

export interface withRole {
  role: string;
}

export const isStudent = (user: withRole | undefined) => user?.role === "student";

export const FOLDERS_HEADING_ID = "folders-section";
export const RESOURCES_HEADING_ID = "resources-section";
export const SHARED_FOLDERS_HEADING_ID = "shared-folders-section";

export const sharedFolderId = (id: string) => `shared-folder-${id}`;
export const folderId = (id: string) => `folder-${id}`;
export const resourceId = (id: string) => `resource-${id}`;
