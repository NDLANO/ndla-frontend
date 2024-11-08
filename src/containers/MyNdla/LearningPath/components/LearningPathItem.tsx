/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { RouteFill } from "@ndla/icons/common";
import { ListItemContent, ListItemHeading, ListItemRoot, ListItemVariantProps, Text } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { linkOverlay } from "@ndla/styled-system/patterns";
import { GQLLearningPath } from "./LearningPathList";

interface Props {
  learningPath: GQLLearningPath;
  variant?: NonNullable<ListItemVariantProps>["variant"];
  context?: NonNullable<ListItemVariantProps>["context"];
  link: string;
}

const TitleWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "small",
    alignItems: "center",
  },
});

const TitleAndDateWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "4xsmall",
  },
});

const LearningPathInfo = styled("div", {
  base: {
    display: "flex",
    gap: "xsmall",
  },
});

const MenuWrapper = styled("div", {
  base: {
    position: "relative",
  },
});

const StyledSafeLink = styled(SafeLink, {
  base: {
    lineClamp: "2",
    overflowWrap: "anywhere",
  },
});

const StyledText = styled(Text, {
  base: {
    color: "text.subtle",
  },
});

const LearningPathItem = ({ learningPath: { id, created, shared, title }, variant, context = "list", link }: Props) => {
  const { t } = useTranslation();
  //Simple component since dnd-component will be updated
  return (
    <ListItemRoot context={context} variant={variant} nonInteractive id={id}>
      <ListItemContent
        css={{
          alignItems: "center",
          flexWrap: "wrap",
          tabletDown: {
            flexDirection: "column",
            alignItems: "flex-start",
          },
        }}
      >
        <TitleWrapper>
          <RouteFill aria-hidden={false} aria-label={t("myNdla.iconMeny.learningpath")} />
          <TitleAndDateWrapper>
            <ListItemHeading asChild consumeCss>
              <StyledSafeLink to={link} unstyled css={linkOverlay.raw()}>
                {title}
              </StyledSafeLink>
            </ListItemHeading>
            <StyledText textStyle="label.small">{`${t("myNdla.learningpath.created")}: ${created} / ${t("myNdla.folder.sharing.shared")}: ${shared}`}</StyledText>
          </TitleAndDateWrapper>
        </TitleWrapper>
        <LearningPathInfo></LearningPathInfo>
      </ListItemContent>
      <MenuWrapper>menu</MenuWrapper>
    </ListItemRoot>
  );
};

export default LearningPathItem;
