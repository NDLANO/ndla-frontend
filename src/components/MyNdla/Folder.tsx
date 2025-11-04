/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { FileTextLine, FolderUserLine, ShareFill, FolderLine, LinkMedium } from "@ndla/icons";
import { ListItemContent, ListItemHeading, ListItemRoot, Text } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { linkOverlay } from "@ndla/styled-system/patterns";
import { GQLFolder } from "../../graphqlTypes";
import { routes } from "../../routeHelpers";
import { FolderTotalCount } from "../../util/folderHelpers";

interface IconCountProps {
  type: "resource" | "folder";
  count?: number;
}

const IconTextWrapper = styled(Text, {
  base: {
    display: "flex",
    gap: "xxsmall",
    alignItems: "center",
    whiteSpace: "nowrap",
    color: "text.subtle",
  },
});

const MobileCount = styled("span", {
  base: {
    tablet: {
      display: "none",
    },
  },
});

const DesktopCount = styled("span", {
  base: {
    display: "block",
    tabletDown: {
      display: "none",
    },
  },
});

const Count = ({ type, count }: IconCountProps) => {
  const Icon = type === "resource" ? FileTextLine : FolderLine;
  const { t } = useTranslation();
  if (!count) return null;

  return (
    <IconTextWrapper textStyle="label.small" aria-label={t(`myNdla.${type}s`, { count })}>
      <Icon size="small" />
      <MobileCount>{count}</MobileCount>
      <DesktopCount>{t(`myNdla.${type}s`, { count })}</DesktopCount>
    </IconTextWrapper>
  );
};

interface Props {
  description?: string;
  menu?: ReactNode;
  folder: GQLFolder;
  foldersCount?: FolderTotalCount;
  isFavorited?: boolean;
  link?: string;
  nonInteractive?: boolean;
}

const getIcon = (isFavorited?: boolean, isShared?: boolean) => {
  if (isFavorited) {
    return LinkMedium;
  } else if (isShared) {
    return FolderUserLine;
  } else {
    return FolderLine;
  }
};

const TitleWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "small",
  },
});

const FolderInfo = styled("div", {
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

const StyledListItemHeading = styled(ListItemHeading, {
  base: {
    lineClamp: "2",
    overflowWrap: "anywhere",
  },
});

const StyledListItemContent = styled(ListItemContent, {
  base: {
    alignItems: "center",
    flexWrap: "wrap",
    tabletDown: {
      flexDirection: "column",
      alignItems: "flex-start",
    },
  },
});

export const Folder = ({
  menu,
  folder: { id, status, name, owner },
  foldersCount,
  isFavorited,
  nonInteractive,
  link,
}: Props) => {
  const { t } = useTranslation();
  const isShared = status === "shared";
  const Icon = getIcon(isFavorited, isShared);
  const defaultLink = isFavorited ? routes.folder(id) : routes.myNdla.folder(id);

  return (
    <ListItemRoot nonInteractive={nonInteractive} id={id}>
      <StyledListItemContent>
        <TitleWrapper>
          <Icon
            aria-hidden={false}
            aria-label={`${isShared ? `${t("myNdla.folder.sharing.shared")} ` : ""}${t("myNdla.folder.folder")}`}
          />
          {nonInteractive ? (
            <StyledListItemHeading>{name}</StyledListItemHeading>
          ) : (
            <StyledListItemHeading asChild consumeCss css={linkOverlay.raw()}>
              <SafeLink to={link ?? defaultLink}>{name}</SafeLink>
            </StyledListItemHeading>
          )}
        </TitleWrapper>
        <FolderInfo>
          {!!isShared && (
            <IconTextWrapper textStyle="label.small">
              <ShareFill size="small" />
              <span aria-hidden={!isFavorited}>
                {isFavorited
                  ? `${t("myNdla.folder.sharing.sharedBy")}${owner ? owner.name : t("myNdla.folder.sharing.sharedByAnonymous")}`
                  : t("myNdla.folder.sharing.shared")}
              </span>
            </IconTextWrapper>
          )}
          {!isFavorited && (
            <>
              <Count type={"folder"} count={foldersCount?.folders} />
              <Count type={"resource"} count={foldersCount?.resources} />
            </>
          )}
        </FolderInfo>
      </StyledListItemContent>
      <MenuWrapper>{menu}</MenuWrapper>
    </ListItemRoot>
  );
};
