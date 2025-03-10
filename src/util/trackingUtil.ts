/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { GQLMyNdlaPersonalDataFragmentFragment } from "../graphqlTypes";

interface Props {
  user?: GQLMyNdlaPersonalDataFragmentFragment;
}

export const getAllDimensions = ({ user }: Props) => {
  if (!user?.role && !user?.organization) {
    return {};
  }
  return {
    CustDimFylke: user?.organization,
    CustDimRolle: user?.role,
  };
};
