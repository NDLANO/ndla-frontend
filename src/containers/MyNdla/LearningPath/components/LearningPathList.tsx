/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from "react";
import LearningPathItem from "./LearningPathItem";
import { BlockWrapper } from "../../../../components/MyNdla/BlockWrapper";
import { PageSpinner } from "../../../../components/PageSpinner";
import WhileLoading from "../../../../components/WhileLoading";

export type GQLLearningPath = {
  id: string;
  created: string;
  shared: string;
  title: string;
  metaImage?: ReactNode;
};

interface Props {
  loading: boolean;
  learningPaths: GQLLearningPath[];
}

function LearningPathList({ loading, learningPaths }: Props) {
  return (
    <WhileLoading isLoading={loading} fallback={<PageSpinner />}>
      {learningPaths.length > 0 && (
        <BlockWrapper>
          {learningPaths.map((learningPath) => (
            <LearningPathItem key={`learningPath-${learningPath.id}`} learningPath={learningPath} link={""} />
          ))}
        </BlockWrapper>
      )}
    </WhileLoading>
  );
}

export default LearningPathList;
