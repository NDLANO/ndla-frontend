/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Outlet, useOutletContext } from "react-router-dom";
import { GQLMyNdlaLearningpathStepFragment } from "../../../graphqlTypes";

type ContextType = { step: GQLMyNdlaLearningpathStepFragment };

interface Props {
  context?: ContextType;
}

export const LearningpathOutlet = ({ context }: Props) => {
  return <Outlet context={context} />;
};

export const useLearningpathStep = () => {
  return useOutletContext<ContextType>();
};
