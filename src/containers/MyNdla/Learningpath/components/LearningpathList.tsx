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
    listStyle: "none",
  },
});

export const LearningpathList = () => {
  const { data, loading } = useMyLearningpaths();

  if (loading) {
    return <Spinner />;
  }

  return (
    <StyledOl>
      {data?.myLearningpaths?.map((learningpath) => (
        <LearningpathListItem showMenu learningpath={learningpath} key={learningpath.id} />
      ))}
    </StyledOl>
  );
};
