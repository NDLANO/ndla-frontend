/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Fragment, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { PencilLine, CheckLine, UserLine, RouteLine } from "@ndla/icons";
import { ListItemContent, ListItemHeading, ListItemRoot, ListItemVariantProps, Text } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { linkOverlay } from "@ndla/styled-system/patterns";
import { useLearningpathActionHooks } from "./LearningpathActionHooks";
import { GQLMyNdlaLearningpathFragment } from "../../../../graphqlTypes";
import { routes } from "../../../../routeHelpers";
import SettingsMenu from "../../components/SettingsMenu";
import { LEARNINGPATH_PRIVATE, LEARNINGPATH_READY_FOR_SHARING, LEARNINGPATH_SHARED } from "../utils";

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

interface Props {
  learningpath: GQLMyNdlaLearningpathFragment;
  showMenu: boolean;
}
export const LearningpathItem = ({ learningpath, showMenu = true, context, ...rest }: Props & ListItemVariantProps) => {
  const { t, i18n } = useTranslation();
  const menuItems = useLearningpathActionHooks(learningpath);

  const MaybeWrapper = context === "list" ? "li" : Fragment;

  const createdString = useMemo(() => {
    const TIME_FORMAT = new Intl.DateTimeFormat(i18n.language);
    const created = TIME_FORMAT.format(new Date(learningpath.created));
    const arr = [t("myNdla.learningpath.created", { created })];
    if (learningpath.madeAvailable) {
      const shared = TIME_FORMAT.format(new Date(learningpath.madeAvailable));
      arr.push(t("myNdla.learningpath.shared", { shared }));
    }
    return arr.join(" \\ ");
  }, [t, i18n, learningpath.created, learningpath.madeAvailable]);

  return (
    <ListItemRoot {...rest} context={context} asChild={context === "list"} consumeCss={context === "list"}>
      <MaybeWrapper>
        <RouteLine />
        <ListItemContent>
          <div>
            <ListItemHeading asChild consumeCss>
              <StyledSafeLink
                to={routes.myNdla.learningpathEditSteps(learningpath.id)}
                unstyled
                css={linkOverlay.raw()}
              >
                {learningpath.title}
              </StyledSafeLink>
            </ListItemHeading>
            <TimestampText textStyle="label.small" color="text.subtle">
              {createdString}
            </TimestampText>
          </div>
          {learningpath.status === LEARNINGPATH_SHARED ? (
            <StatusText textStyle="label.small">
              <UserLine size="small" />
              {t("myNdla.learningpath.status.shared")}
            </StatusText>
          ) : learningpath.status === LEARNINGPATH_PRIVATE ? (
            <StatusText textStyle="label.small">
              <PencilLine size="small" />
              {t("myNdla.learningpath.status.private")}
            </StatusText>
          ) : learningpath.status === LEARNINGPATH_READY_FOR_SHARING ? (
            <StatusText textStyle="label.small">
              <CheckLine size="small" />
              {t("myNdla.learningpath.status.readyForSharing")}
            </StatusText>
          ) : null}
        </ListItemContent>
        {showMenu ? (
          <MenuWrapper>
            <SettingsMenu menuItems={menuItems} />
          </MenuWrapper>
        ) : null}
      </MaybeWrapper>
    </ListItemRoot>
  );
};
