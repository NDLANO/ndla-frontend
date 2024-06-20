/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { fonts, spacing, colors, mq, breakpoints, stackOrder } from "@ndla/core";
import { FileDocumentOutline, Share, Link } from "@ndla/icons/common";
import { FolderOutlined, FolderSharedOutlined } from "@ndla/icons/contentType";
import { SafeLink } from "@ndla/safelink";
import { GQLFolder } from "../../../graphqlTypes";
import { routes } from "../../../routeHelpers";
import { FolderTotalCount } from "../../../util/folderHelpers";

export type LayoutType = "list" | "listLarger" | "block";

const FolderWrapper = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  justify-content: space-between;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-word;

  ${mq.range({ until: breakpoints.mobileWide })} {
    &:not([data-type="list"]) {
      flex-direction: column;
      align-items: unset;
    }
  }

  &[data-type="block"] {
    flex-direction: column;
    align-items: unset;
  }

  border: 1px solid ${colors.brand.neutral7};
  cursor: pointer;
  border-radius: 2px;
  box-shadow: none;
  text-decoration: none;
  &:hover {
    box-shadow: 1px 1px 6px 2px rgba(9, 55, 101, 0.08);
    transition-duration: 0.2s;
    [data-title] {
      color: ${colors.brand.primary};
      text-decoration: underline;
    }
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  margin: ${spacing.nsmall};
  flex-direction: row;
  align-items: center;
  gap: ${spacing.xsmall};
  justify-content: space-between;
  &[data-type="block"] {
    margin-bottom: 0;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  border-radius: 100%;
  color: ${colors.brand.primary};
  svg {
    width: 20px;
    height: 20px;
  }
`;

const ResourceTitleLink = styled(SafeLink)`
  box-shadow: none;
  color: ${colors.brand.primary};
  flex: 1;
  &[data-resource-available="false"] {
    color: ${colors.brand.grey};
    font-style: italic;
  }
  :after {
    content: "";
    position: absolute;
    z-index: ${stackOrder.offsetSingle};
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
`;

const FolderTitle = styled.h2`
  ${fonts.sizes("16px", "20px")};
  font-weight: ${fonts.weight.semibold};
  margin: 0px !important;
  flex: 1;

  overflow: hidden;
  text-overflow: ellipsis;
  /* Unfortunate css needed for multi-line text overflow ellipsis. */
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
`;

const MenuWrapper = styled.div`
  display: flex;
  z-index: ${stackOrder.offsetSingle};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const CountContainer = styled.div`
  overflow: hidden;
  display: flex;
  flex-direction: row;
  min-height: 44px;
  gap: ${spacing.small};
  margin: 0 ${spacing.small} 0 ${spacing.nsmall};

  ${mq.range({ until: breakpoints.tablet })} {
    &[data-type="list"] {
      display: none;
    }
  }
`;

const IconTextWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.xxsmall};
  color: ${colors.brand.grey};
  white-space: nowrap;
  svg {
    width: 13px;
    height: 13px;
  }
  ${fonts.sizes(16)};
`;

interface IconCountProps {
  type: "resource" | "folder";
  count?: number;
  layoutType: LayoutType;
}

const Count = ({ type, count, layoutType }: IconCountProps) => {
  const Icon = type === "resource" ? FileDocumentOutline : FolderOutlined;
  const { t } = useTranslation();
  if (!count) return null;

  return (
    <IconTextWrapper data-type={layoutType}>
      <Icon />
      <span>{t(`myNdla.${type}s`, { count })}</span>
    </IconTextWrapper>
  );
};

interface Props {
  description?: string;
  type?: LayoutType;
  menu?: ReactNode;
  folder: GQLFolder;
  foldersCount: Record<string, FolderTotalCount>;
}

const getIcon = (isOwner: boolean, isShared?: boolean) => {
  if (!isOwner) {
    return Link;
  } else if (isShared) {
    return FolderSharedOutlined;
  } else {
    return FolderOutlined;
  }
};

export const Folder = ({
  type = "list",
  menu,
  folder: { id, status, __typename, name, owner },
  foldersCount,
}: Props) => {
  const { t } = useTranslation();
  const Icon = getIcon(__typename === "Folder", status === "shared");

  return (
    <FolderWrapper data-type={type} id={id}>
      <TitleWrapper data-type={type}>
        <IconWrapper
          aria-label={`${status === "shared" ? `${t("myNdla.folder.sharing.shared")} ` : ""}${t("myNdla.folder.folder")}`}
        >
          <Icon />
        </IconWrapper>
        <ResourceTitleLink to={__typename === "Folder" ? routes.myNdla.folder(id) : routes.folder(id)}>
          <FolderTitle data-title="" title={name}>
            {name}
          </FolderTitle>
        </ResourceTitleLink>
      </TitleWrapper>
      <MenuWrapper>
        <CountContainer data-type={type}>
          {status === "shared" && (
            <IconTextWrapper>
              <Share />
              {__typename !== "Folder" ? (
                <span>
                  {t("myNdla.folder.sharing.sharedBy")}
                  {owner ? `${owner?.name}` : t("myNdla.folder.sharing.sharedByAnonymous")}
                </span>
              ) : (
                <span aria-hidden>{t("myNdla.folder.sharing.shared")}</span>
              )}
            </IconTextWrapper>
          )}
          {__typename === "Folder" && (
            <>
              <Count layoutType={type} type={"folder"} count={foldersCount[id]?.folders} />
              <Count layoutType={type} type={"resource"} count={foldersCount[id]?.resources} />
            </>
          )}
        </CountContainer>
        {menu}
      </MenuWrapper>
    </FolderWrapper>
  );
};
