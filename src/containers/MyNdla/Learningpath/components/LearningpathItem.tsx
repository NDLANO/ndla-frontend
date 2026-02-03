/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { PencilLine, CheckLine, UserLine, RouteLine } from "@ndla/icons";
import { ListItemContent, ListItemHeading, ListItemRoot, ListItemVariantProps, Text } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { linkOverlay } from "@ndla/styled-system/patterns";
import { Fragment, ReactNode, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { GQLMyNdlaLearningpathFragment } from "../../../../graphqlTypes";
import { routes } from "../../../../routeHelpers";
import {
  LEARNINGPATH_PRIVATE,
  LEARNINGPATH_READY_FOR_SHARING,
  LEARNINGPATH_SHARED,
  learningpathListItemId,
} from "../utils";

const StatusText = styled(Text, {
  base: {
    display: "flex",
    gap: "xxsmall",
    alignItems: "center",
  },
});

const StyledListItemHeading = styled(ListItemHeading, {
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
  context?: "list" | "standalone";
  menu?: ReactNode;
}
export const LearningpathItem = ({ learningpath, context, menu, ...rest }: Props & ListItemVariantProps) => {
  const { t, i18n } = useTranslation();

  const MaybeWrapper = context === "list" ? "li" : Fragment;

  const createdString = useMemo(() => {
    const TIME_FORMAT = new Intl.DateTimeFormat(i18n.language);
    const created = TIME_FORMAT.format(new Date(learningpath.created));
    const arr = [t("myNdla.learningpath.created", { created })];
    if (learningpath.madeAvailable && learningpath.status === LEARNINGPATH_SHARED) {
      const shared = TIME_FORMAT.format(new Date(learningpath.madeAvailable));
      arr.push(t("myNdla.learningpath.shared", { shared }));
    }
    return arr.join(" \\ ");
  }, [i18n.language, learningpath.created, learningpath.madeAvailable, learningpath.status, t]);

  return (
    <ListItemRoot
      {...rest}
      id={learningpathListItemId(learningpath.id)}
      asChild={context === "list"}
      consumeCss={context === "list"}
    >
      <MaybeWrapper>
        <RouteLine />
        <ListItemContent>
          <div>
            <StyledListItemHeading asChild consumeCss css={linkOverlay.raw()}>
              <SafeLink to={routes.myNdla.learningpathEditSteps(learningpath.id)} unstyled>
                {learningpath.title}
              </SafeLink>
            </StyledListItemHeading>
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
        {menu ? <MenuWrapper>{menu}</MenuWrapper> : null}
      </MaybeWrapper>
    </ListItemRoot>
  );
};
