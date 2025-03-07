/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { GQLGroupSearchQuery } from "../../graphqlTypes";

export type SearchCompetenceGoal = Required<GQLGroupSearchQuery>["competenceGoals"][0];

export type SearchCoreElements = Required<GQLGroupSearchQuery>["coreElements"][0];
