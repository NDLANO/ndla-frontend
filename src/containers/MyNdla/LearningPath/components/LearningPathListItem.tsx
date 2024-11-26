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
import { ListItemContent, ListItemHeading, ListItemRoot, Text } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { linkOverlay } from "@ndla/styled-system/patterns";
import { useLearningPathActionHooks } from "./LearningPathActionHooks";
import { GQLLearningpathFragment } from "../../../../graphqlTypes";
import { routes } from "../../../../routeHelpers";
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

const StatusText = styled(Text, {
  base: {
    display: "flex",
    gap: "4xsmall",
    alignItems: "center",
  },
});

const StyledSafeLink = styled(SafeLink, {
  base: {
    lineClamp: "2",
    overflowWrap: "anywhere",
  },
});

const TimestampText = styled(Text, {
  base: {
    mobileWideDown: {
      display: "none",
    },
  },
});

const MenuWrapper = styled("div", {
  base: {
    position: "relative",
  },
});

interface Props {
  learningPath: GQLLearningpathFragment;
  showMenu: Boolean;
}
export const LearningPathListItem = ({ learningPath, showMenu = true }: Props) => {
  const { t } = useTranslation();
  const menuItems = useLearningPathActionHooks(learningPath);

  return (
    <StyledListItemRoot context="list" asChild consumeCss>
      <li>
        <LearningPath />
        <ListItemContent>
          <TextWrapper>
            <ListItemHeading asChild consumeCss>
              <StyledSafeLink to={routes.myNdla.learningpathEdit(learningPath.id)} unstyled css={linkOverlay.raw()}>
                {learningPath.title}
              </StyledSafeLink>
            </ListItemHeading>
            <TimestampText textStyle="label.small" color="text.subtle">
              {t("myNdla.learningpath.created", {
                created: Intl.DateTimeFormat("no").format(new Date(learningPath.created)),
              })}
              {learningPath.madeAvailable
                ? t("myNdla.learningpath.shared", {
                    shared: Intl.DateTimeFormat("no").format(new Date(learningPath.madeAvailable)),
                  })
                : null}
            </TimestampText>
          </TextWrapper>
          {learningPath.status === "UNLISTED" && (
            <StatusText textStyle="label.small">
              <PersonOutlined size="small" />
              {t("myNdla.learningpath.status.delt")}
            </StatusText>
          )}
          {learningPath.status === "PRIVATE" && (
            <StatusText textStyle="label.small">
              <PencilLine size="small" />
              {t("myNdla.learningpath.status.private")}
            </StatusText>
          )}
          {learningPath.status === "READY_FOR_SHARING" && (
            <StatusText textStyle="label.small">
              <CheckLine size="small" />
              {t("myNdla.learningpath.status.readyForSharing")}
            </StatusText>
          )}
        </ListItemContent>
        {showMenu ? (
          <MenuWrapper>
            <SettingsMenu menuItems={menuItems} />
          </MenuWrapper>
        ) : null}
      </li>
    </StyledListItemRoot>
  );
};
