/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import parse from "html-react-parser";
import { useTranslation } from "react-i18next";
import { Spinner, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { LearningpathListItem } from "./LearningpathListItem";
import { useMyLearningpaths } from "../learningpathQueries";

const StyledOl = styled("ol", {
  base: {
    listStyle: "none",
  },
});

export const LearningpathList = () => {
  const { t } = useTranslation();

  // TODO: Better error handling https://github.com/NDLANO/Issues/issues/4242
  const { data, loading } = useMyLearningpaths();

  if (loading) {
    return <Spinner />;
  }

  return (
    <StyledOl>
      {data?.myLearningpaths && data.myLearningpaths.length > 0 ? (
        data.myLearningpaths.map((learningpath) => (
          <LearningpathListItem showMenu learningpath={learningpath} key={learningpath.id} />
        ))
      ) : (
        <Text textStyle="label.medium" fontWeight="light">
          {parse(t("myNdla.learningpath.noPath"))}
        </Text>
      )}
    </StyledOl>
  );
};
