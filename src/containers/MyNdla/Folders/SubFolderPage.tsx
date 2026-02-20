/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useQuery } from "@apollo/client/react";
import { FolderLine, FolderUserLine } from "@ndla/icons";
import { Heading } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { AuthContext } from "../../../components/AuthenticationContext";
import { DefaultErrorMessage } from "../../../components/DefaultErrorMessage";
import { MyNdlaBreadcrumb } from "../../../components/MyNdla/MyNdlaBreadcrumb";
import { MyNdlaTitle, TitleWrapper } from "../../../components/MyNdla/MyNdlaTitle";
import { PageSpinner } from "../../../components/PageSpinner";
import { PageTitle } from "../../../components/PageTitle";
import { GQLFolder, GQLFoldersPageQuery } from "../../../graphqlTypes";
import { foldersPageQuery, useFolder } from "../../../mutations/folder/folderQueries";
import { PrivateRoute } from "../../PrivateRoute/PrivateRoute";
import { MyNdlaPageSection } from "../components/MyNdlaPageSection";
import { MyNdlaPageWrapper } from "../components/MyNdlaPageWrapper";
import { PageActions } from "../components/PageActions";
import { useFolderActions } from "./components/FolderActionHooks";
import { FolderList } from "./components/FolderList";
import { ResourceList } from "./components/ResourceList";
import { FOLDERS_HEADING_ID, RESOURCES_HEADING_ID } from "./util";

const StyledEm = styled("em", {
  base: {
    whiteSpace: "pre-wrap",
  },
});

const TitleRow = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    gap: "xsmall",
  },
});

export const Component = () => {
  return <PrivateRoute element={<SubFolderPage />} />;
};

const SubFolderPage = () => {
  const { t } = useTranslation();
  const { folderId } = useParams();
  const { examLock } = useContext(AuthContext);
  // We load this to ensure all folders are in cache.
  const { loading } = useQuery<GQLFoldersPageQuery>(foldersPageQuery);
  const selectedFolder = useFolder(folderId);

  const title = useMemo(() => {
    return t("htmlTitles.myFolderPage", { folderName: selectedFolder?.name });
  }, [selectedFolder?.name, t]);

  const folders: GQLFolder[] = useMemo(() => selectedFolder?.subfolders ?? [], [selectedFolder]);

  const menuItems = useFolderActions(selectedFolder, undefined, true);

  if (loading) {
    return <PageSpinner />;
  }

  if (!selectedFolder) {
    return <DefaultErrorMessage />;
  }

  return (
    <MyNdlaPageWrapper>
      <PageTitle title={title} />
      <MyNdlaPageSection>
        <TitleWrapper>
          <MyNdlaBreadcrumb breadcrumbs={selectedFolder.breadcrumbs} page="favorites" />
          <TitleRow>
            {selectedFolder.status === "shared" ? <FolderUserLine /> : <FolderLine />}
            <MyNdlaTitle title={selectedFolder.name} />
          </TitleRow>
        </TitleWrapper>
        <p>
          <StyledEm>{selectedFolder.description ?? t("myNdla.folder.defaultPageDescription")}</StyledEm>
        </p>
      </MyNdlaPageSection>
      <MyNdlaPageSection>
        <Heading asChild consumeCss textStyle="heading.small" id={FOLDERS_HEADING_ID} tabIndex={-1}>
          <h2>{t("myNdla.folder.folders")}</h2>
        </Heading>
        {!examLock && <PageActions actions={menuItems} />}
        <FolderList labelledBy={FOLDERS_HEADING_ID} folders={folders} />
      </MyNdlaPageSection>
      <MyNdlaPageSection>
        <Heading asChild consumeCss textStyle="heading.small" id={RESOURCES_HEADING_ID} tabIndex={-1}>
          <h2>{t("myNdla.folder.resources")}</h2>
        </Heading>
        <ResourceList
          selectedFolder={selectedFolder}
          resources={selectedFolder.resources}
          labelledBy={RESOURCES_HEADING_ID}
        />
      </MyNdlaPageSection>
    </MyNdlaPageWrapper>
  );
};
