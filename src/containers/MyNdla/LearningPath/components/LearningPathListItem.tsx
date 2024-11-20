/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { PencilLine } from "@ndla/icons/action";
import { PersonOutlined } from "@ndla/icons/common";
import { LearningPath } from "@ndla/icons/contentType";
import { CheckLine } from "@ndla/icons/editor";
import { ListItemContent, ListItemRoot, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { useLearningPathActionHooks } from "./LearningPathActionHooks";
import { GQLLearningpathFragmentFragment, GQLMyLearningpathFragment } from "../../../../graphqlTypes";
import SettingsMenu from "../../components/SettingsMenu";

const StyledListItemRoot = styled(ListItemRoot, {
  base: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

const TextWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
});

const StatusWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "4xsmall",
    alignItems: "center",
  },
});

const StatusText = styled(Text, {
  base: {
    display: "flex",
    gap: "4xsmall",
    alignItems: "center",
  },
});

interface Props {
  learningPath: GQLMyLearningpathFragment;
  showMenu: Boolean;
}
export const LearningPathListItem = ({ learningPath, showMenu = true }: Props) => {
  const { t } = useTranslation();
  const menuItems = useLearningPathActionHooks(learningPath);

  return (
    <StyledListItemRoot>
      <LearningPath />
      <ListItemContent>
        <TextWrapper>
          <Text>{learningPath.title}</Text>
          <Text textStyle="label.small" color="text.subtle">
            {t("myNdla.learningpath.createShared")}
          </Text>
        </TextWrapper>
        <StatusWrapper>
          {learningPath.status === "published" && (
            <StatusText textStyle="label.small">
              <PersonOutlined size="small" />
              {t("myNdla.learningpath.status.delt")}
            </StatusText>
          )}
          {learningPath.status === "private" && (
            <StatusText textStyle="label.small">
              <PencilLine size="small" />
              {t("myNdla.learningpath.status.private")}
            </StatusText>
          )}
          {learningPath.status === "readyForSharing" && (
            <StatusText textStyle="label.small">
              <CheckLine size="small" />
              {t("myNdla.learningpath.status.ready_for_sharing")}
            </StatusText>
          )}
          {showMenu ? <SettingsMenu menuItems={menuItems} /> : null}
        </StatusWrapper>
      </ListItemContent>
    </StyledListItemRoot>
  );
};
