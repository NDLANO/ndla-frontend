/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import LearningPathItem from "./LearningPathItem";
import { BlockWrapper } from "../../../../components/MyNdla/BlockWrapper";
import { PageSpinner } from "../../../../components/PageSpinner";
import WhileLoading from "../../../../components/WhileLoading";
import { GQLMyLearningpathFragment } from "../../../../graphqlTypes";

interface Props {
  loading: boolean;
  learningPaths?: GQLMyLearningpathFragment[];
}

function LearningPathList({ loading, learningPaths }: Props) {
  return (
    <WhileLoading isLoading={loading} fallback={<PageSpinner />}>
      {learningPaths?.length && (
        <BlockWrapper>
          {learningPaths?.map((learningPath) => (
            <LearningPathItem key={`learningPath-${learningPath.id}`} learningPath={learningPath} link={""} />
          ))}
        </BlockWrapper>
      )}
    </WhileLoading>
  );
}

export default LearningPathList;
