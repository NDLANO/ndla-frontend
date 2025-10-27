/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { FolderUserLine, FolderLine } from "@ndla/icons";
import { Skeleton } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { MyNdlaBreadcrumb } from "./MyNdlaBreadcrumb";
import { MyNdlaTitle, TitleWrapper } from "./MyNdlaTitle";
import { GQLFolder } from "../../graphqlTypes";

const TitleRow = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    gap: "xsmall",
  },
});

const StyledSkeleton = styled(Skeleton, {
  base: {
    maxWidth: "surface.medium",
    minWidth: "surface.medium",
  },
  defaultVariants: { selectedFolder: false },
  variants: {
    selectedFolder: {
      true: {
        height: "xxlarge",
      },
      false: {
        height: "medium",
      },
    },
  },
});

interface Props {
  loading?: boolean;
  selectedFolder: GQLFolder | null;
  enableBreadcrumb?: boolean;
}

export const FoldersPageTitle = ({ loading = false, selectedFolder, enableBreadcrumb = true }: Props) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <TitleWrapper>
        {!!selectedFolder && !!enableBreadcrumb && <StyledSkeleton />}
        <StyledSkeleton selectedFolder={!!selectedFolder} />
      </TitleWrapper>
    );
  }

  return (
    <TitleWrapper>
      {!!enableBreadcrumb && <MyNdlaBreadcrumb breadcrumbs={selectedFolder?.breadcrumbs ?? []} page="folders" />}
      <TitleRow>
        {selectedFolder ? selectedFolder.status === "shared" ? <FolderUserLine /> : <FolderLine /> : null}
        <MyNdlaTitle title={selectedFolder?.name ?? t("myNdla.myFolders")} />
      </TitleRow>
    </TitleWrapper>
  );
};
