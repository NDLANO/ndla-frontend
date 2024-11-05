/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ListItemContent, ListItemHeading, ListItemRoot, ListItemVariantProps } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import SettingsMenu from "../../../../containers/MyNdla/components/SettingsMenu";
import { useFolderActions } from "../../../../containers/MyNdla/Folders/components/FolderActionHooks";
import { linkOverlay } from "@ndla/styled-system/patterns";
import { RouteFill } from "@ndla/icons/common";
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

const LearningPathItem = ({
  learningPath: { id, createdDate, sharedDate, title },
  variant,
  context = "list",
  link,
}: Props) => {
  const { t } = useTranslation();

  // const folderMenuActions = useFolderActions(folder, setFocusId, folders, false, folderRefId, isFavorited);

  // const menu = useMemo(
  //   () => <SettingsMenu menuItems={folderMenuActions} modalHeader={t("myNdla.tools")} />,
  //   [folderMenuActions, t],
  // );

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
          <ListItemHeading asChild consumeCss>
            <StyledSafeLink to={link} unstyled css={linkOverlay.raw()}>
              {title}
            </StyledSafeLink>
          </ListItemHeading>
        </TitleWrapper>
        <LearningPathInfo></LearningPathInfo>
      </ListItemContent>
      <MenuWrapper>menu</MenuWrapper>
    </ListItemRoot>
  );
};

export default LearningPathItem;
