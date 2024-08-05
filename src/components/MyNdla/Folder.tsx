/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { FileTextLine, ShareFill } from "@ndla/icons/common";
import { FolderUserLine } from "@ndla/icons/contentType";
import { FolderLine, LinkMedium } from "@ndla/icons/editor";
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

const StyledSafeLink = styled(SafeLink, {
  base: { display: "block" },
});

const SingleLineLink = ({ link, text }: { link: string; text: string }) => {
  const textRef = useRef<HTMLAnchorElement>(null);
  const [clampedText, setClampedText] = useState(text);

  useEffect(() => {
    const clampText = () => {
      const textElement = textRef.current;
      if (textElement) {
        const lineHeight = parseFloat(window.getComputedStyle(textElement).lineHeight);
        let truncatedText = text;

        (textElement as HTMLAnchorElement).innerText = truncatedText;

        while (textElement.scrollHeight > lineHeight && truncatedText.length > 0) {
          truncatedText = truncatedText.slice(0, -1);
          textElement.innerText = truncatedText + "...";
        }
        setClampedText(truncatedText);
      }
    };

    clampText();
  });

  return (
    <StyledSafeLink to={link} unstyled css={linkOverlay.raw()} ref={textRef}>
      {clampedText}
    </StyledSafeLink>
  );
};

export const Folder = ({ menu, folder: { id, status, name, owner }, foldersCount, isFavorited, link }: Props) => {
  const { t } = useTranslation();
  const isShared = status === "shared";
  const Icon = getIcon(isFavorited, isShared);
  const defaultLink = isFavorited ? routes.folder(id) : routes.myNdla.folder(id);

  return (
    <ListItemRoot variant="list" id={id}>
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
          <Icon
            aria-hidden={false}
            aria-label={`${isShared ? `${t("myNdla.folder.sharing.shared")} ` : ""}${t("myNdla.folder.folder")}`}
          />
          <ListItemHeading asChild consumeCss>
            <h2>
              <SingleLineLink link={link ?? defaultLink} text={name} />
            </h2>
          </ListItemHeading>
        </TitleWrapper>
        <FolderInfo>
          {isShared && (
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
      </ListItemContent>
      <MenuWrapper>{menu}</MenuWrapper>
    </ListItemRoot>
  );
};
