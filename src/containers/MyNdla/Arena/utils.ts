/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export const toArenaTopic = (topicId: number) => `/minndla/arena/topic/${topicId}`;

export const toArenaCategory = (categoryId: number) => `/minndla/arena/category/${categoryId}`;

export const toArena = () => `/minndla/arena`;

export const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export const toAllNotifications = () => '/minndla/arena/notifications';
