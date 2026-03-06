/**
 * Copyright (c) 2026-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";
import { useMemo } from "react";
import { GQLLearningpathNavigation_LearningpathFragment } from "../../../graphqlTypes";
import { routes, toLearningPath } from "../../../routeHelpers";
import { ResourceNavigation } from "../../Resource/ResourceNavigation";

interface Props {
  learningpath: GQLLearningpathNavigation_LearningpathFragment;
  context: "default" | "preview";
  currentId: number | undefined;
  resourcePath: string | undefined;
  parentUrl: string | undefined;
}

export const LearningpathNavigation = ({ learningpath, currentId, context, parentUrl, resourcePath }: Props) => {
  const stepsWithIntro = useMemo(() => {
    const steps = [];
    if (learningpath.introduction?.length) {
      steps.push({ id: undefined });
    }
    steps.push(...learningpath.learningsteps);
    return steps;
  }, [learningpath.introduction?.length, learningpath.learningsteps]);

  return (
    <ResourceNavigation
      items={stepsWithIntro}
      currentId={currentId}
      getId={(step) => step.id}
      getUrl={(step) =>
        step == null
          ? undefined
          : context === "preview"
            ? routes.myNdla.learningpathPreview(learningpath.id, step?.id)
            : toLearningPath(learningpath.id, step?.id, resourcePath)
      }
      parentUrl={parentUrl}
    />
  );
};

LearningpathNavigation.fragments = {
  learningpath: gql`
    fragment LearningpathNavigation_Learningpath on BaseLearningpath {
      id
      introduction
      learningsteps {
        id
      }
    }
  `,
};
