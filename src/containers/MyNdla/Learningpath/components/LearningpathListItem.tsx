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
import { useLearningpathActionHooks } from "./LearningpathActionHooks";
import { LEARNINGPATH_PRIVATE, LEARNINGPATH_READY_FOR_SHARING, LEARNINGPATH_SHARED } from "./utils";
import { GQLLearningpathFragment } from "../../../../graphqlTypes";
import { routes } from "../../../../routeHelpers";
import SettingsMenu from "../../components/SettingsMenu";

const StatusText = styled(Text, {
  base: {
    display: "flex",
    gap: "xxsmall",
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

const TIME_FORMAT = Intl.DateTimeFormat("no");

interface Props {
  learningpath: GQLLearningpathFragment;
  showMenu: boolean;
}
export const LearningpathListItem = ({ learningpath, showMenu = true }: Props) => {
  const { t } = useTranslation();
  const menuItems = useLearningpathActionHooks(learningpath);

  return (
    <ListItemRoot context="list" asChild consumeCss>
      <li>
        <LearningPath />
        <ListItemContent>
          <div>
            <ListItemHeading asChild consumeCss>
              <StyledSafeLink to={routes.myNdla.learningpathEdit(learningpath.id)} unstyled css={linkOverlay.raw()}>
                {learningpath.title}
              </StyledSafeLink>
            </ListItemHeading>
            <TimestampText textStyle="label.small" color="text.subtle">
              {`${t("myNdla.learningpath.created", {
                created: TIME_FORMAT.format(new Date(learningpath.created)),
              })} `}
              {learningpath.madeAvailable
                ? `\\ ${t("myNdla.learningpath.shared", {
                    shared: TIME_FORMAT.format(new Date(learningpath.madeAvailable)),
                  })}`
                : null}
            </TimestampText>
          </div>
          {learningpath.status === LEARNINGPATH_SHARED && (
            <StatusText textStyle="label.small">
              <PersonOutlined size="small" />
              {t("myNdla.learningpath.status.delt")}
            </StatusText>
          )}
          {learningpath.status === LEARNINGPATH_PRIVATE && (
            <StatusText textStyle="label.small">
              <PencilLine size="small" />
              {t("myNdla.learningpath.status.private")}
            </StatusText>
          )}
          {learningpath.status === LEARNINGPATH_READY_FOR_SHARING && (
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
    </ListItemRoot>
  );
};
