/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { memo } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { spacing } from "@ndla/core";
import { FolderOutlined, FolderSharedOutlined } from "@ndla/icons/contentType";
import { ContentLoader } from "@ndla/ui";
import WhileLoading from "../../../components/WhileLoading";
import { GQLFolder } from "../../../graphqlTypes";
import MyNdlaBreadcrumb from "../components/MyNdlaBreadcrumb";
import MyNdlaTitle from "../components/MyNdlaTitle";
import TitleWrapper from "../components/TitleWrapper";

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.small};
`;

const StyledContentLoader = styled(ContentLoader)`
  max-width: 500px;
  min-width: 500px;
`;

interface Props {
  loading?: boolean;
  selectedFolder: GQLFolder | null;
  enableBreadcrumb?: boolean;
}

const FoldersPageTitle = ({ loading = false, selectedFolder, enableBreadcrumb = true }: Props) => {
  const { t } = useTranslation();

  return (
    <TitleWrapper>
      {enableBreadcrumb && (
        <WhileLoading
          isLoading={loading}
          fallback={
            !!selectedFolder && (
              <ContentLoader width={500} height={30}>
                <rect x="0" y="2" rx="3" ry="3" width="400" height="25" key="rect-1" />
              </ContentLoader>
            )
          }
        >
          <MyNdlaBreadcrumb breadcrumbs={selectedFolder?.breadcrumbs ?? []} page="folders" />
        </WhileLoading>
      )}
      <TitleRow>
        <WhileLoading
          fallback={
            <StyledContentLoader width={500} height={selectedFolder ? 44 : 28}>
              <rect x="0" y="2" rx="3" ry="3" width="300" height={selectedFolder ? "40" : "24"} key="rect-1" />
            </StyledContentLoader>
          }
          isLoading={loading}
        >
          {selectedFolder ? (
            selectedFolder.status === "shared" ? (
              <FolderSharedOutlined size="large" />
            ) : (
              <FolderOutlined size="large" />
            )
          ) : null}
          <MyNdlaTitle title={selectedFolder?.name ?? t("myNdla.myFolders")} />
        </WhileLoading>
      </TitleRow>
    </TitleWrapper>
  );
};

export default memo(FoldersPageTitle);
