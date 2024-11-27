/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Spinner } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { LearningpathListItem } from "./LearningpathListItem";
import { useMyLearningpaths } from "../../learningpathQueries";

const StyledOl = styled("ol", {
  base: {
    display: "flex",
    flexDirection: "column",
  },
});

interface Props {}

export const LearningpathList = (_props: Props) => {
  const { learningpaths, loading } = useMyLearningpaths();

  if (loading) {
    return <Spinner />;
  }

  return (
    <StyledOl>
      {learningpaths?.map((learningpath) => (
        <LearningpathListItem showMenu learningPath={learningpath} key={learningpath.id} />
      ))}
    </StyledOl>
  );
};
