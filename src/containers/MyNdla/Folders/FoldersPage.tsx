/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useQuery } from "@apollo/client/react";
import { Heading } from "@ndla/primitives";
import { SafeLinkButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { AuthContext } from "../../../components/AuthenticationContext";
import { FoldersPageTitle } from "../../../components/MyNdla/FoldersPageTitle";
import { PageTitle } from "../../../components/PageTitle";
import { GQLFolder, GQLFoldersPageQuery } from "../../../graphqlTypes";
import { foldersPageQuery, useFolder } from "../../../mutations/folder/folderQueries";
import { routes } from "../../../routeHelpers";
import { getAllTags } from "../../../util/folderHelpers";
import { PrivateRoute } from "../../PrivateRoute/PrivateRoute";
import { MyNdlaPageSection } from "../components/MyNdlaPageSection";
import { MyNdlaPageWrapper } from "../components/MyNdlaPageWrapper";
import { PageActions } from "../components/PageActions";
import { useFolderActions } from "./components/FolderActionHooks";
import { FolderList } from "./components/FolderList";
import { ResourceList } from "./components/ResourceList";
import { FOLDERS_HEADING_ID, RESOURCES_HEADING_ID, SHARED_FOLDERS_HEADING_ID } from "./util";

const StyledEm = styled("em", {
  base: {
    whiteSpace: "pre-wrap",
  },
});

const StyledUl = styled("ul", {
  base: {
    display: "flex",
    flexWrap: "wrap",
    gap: "xsmall",
    listStyle: "none",
  },
});

const TagsHeading = styled(Heading, {
  base: {
    marginBlockStart: "xlarge",
  },
});

const TagSafeLink = styled(SafeLinkButton, {
  base: {
    color: "text.default",
    background: "surface.action.myNdla",
    boxShadowColor: "stroke.warning",
    _hover: {
      background: "surface.action.myNdla.hover",
    },
    _active: {
      background: "surface.action.myNdla",
    },
  },
});

export const Component = () => {
  return <PrivateRoute element={<FoldersPage />} />;
};

export const FoldersPage = () => {
  const { t } = useTranslation();
  const { folderId } = useParams();
  const { examLock } = useContext(AuthContext);
  const { data, loading } = useQuery<GQLFoldersPageQuery>(foldersPageQuery);
  const selectedFolder = useFolder(folderId);

  const title = useMemo(() => {
    if (folderId) {
      return t("htmlTitles.myFolderPage", { folderName: selectedFolder?.name });
    } else return t("htmlTitles.myFoldersPage");
  }, [folderId, selectedFolder?.name, t]);

  const folders: GQLFolder[] = useMemo(
    () => (selectedFolder ? selectedFolder.subfolders : ((data?.folders.folders as GQLFolder[]) ?? [])),
    [selectedFolder, data?.folders],
  );
  const sharedByOthersFolders = useMemo(
    () => (!selectedFolder ? (data?.folders.sharedFolders ?? []) : []),
    [selectedFolder, data?.folders.sharedFolders],
  );

  const menuItems = useFolderActions(selectedFolder, undefined, true);

  const tags = useMemo(() => getAllTags(folders), [folders]);

  return (
    <MyNdlaPageWrapper>
      <PageTitle title={title} />
      <MyNdlaPageSection>
        <FoldersPageTitle key={selectedFolder?.id} loading={loading} selectedFolder={selectedFolder} />
        {!!selectedFolder && (
          <p>
            <StyledEm>{selectedFolder.description ?? t("myNdla.folder.defaultPageDescription")}</StyledEm>
          </p>
        )}
      </MyNdlaPageSection>
      <MyNdlaPageSection>
        <Heading asChild consumeCss textStyle="heading.small" id={FOLDERS_HEADING_ID} tabIndex={-1}>
          <h2>{t("myNdla.folder.folders")}</h2>
        </Heading>
        {!examLock && <PageActions actions={menuItems} />}
        <FolderList labelledBy={FOLDERS_HEADING_ID} folders={folders} loading={loading} folderId={folderId} />
      </MyNdlaPageSection>
      {!!selectedFolder && (
        <MyNdlaPageSection>
          <Heading asChild consumeCss textStyle="heading.small" id={RESOURCES_HEADING_ID} tabIndex={-1}>
            <h2>{t("myNdla.folder.resources")}</h2>
          </Heading>
          <ResourceList selectedFolder={selectedFolder} labelledBy={RESOURCES_HEADING_ID} />
        </MyNdlaPageSection>
      )}
      {!selectedFolder && (
        <MyNdlaPageSection>
          <Heading asChild consumeCss textStyle="heading.small" id={SHARED_FOLDERS_HEADING_ID} tabIndex={-1}>
            <h2>{t("myNdla.sharedByOthersFolders")}</h2>
          </Heading>
          <FolderList
            labelledBy={SHARED_FOLDERS_HEADING_ID}
            folders={sharedByOthersFolders as unknown as GQLFolder[]}
            loading={loading}
            folderId={folderId}
            isFavorited
          />
        </MyNdlaPageSection>
      )}
      {!selectedFolder && tags.length ? (
        <>
          <TagsHeading asChild consumeCss textStyle="heading.small">
            <h2>{t("myNdla.tagsTitle")}</h2>
          </TagsHeading>
          <nav aria-labelledby="tags-header">
            <StyledUl>
              {tags?.map((tag) => (
                <li key={tag}>
                  <TagSafeLink variant="secondary" size="small" key={tag} to={routes.myNdla.tag(tag)}>
                    {tag}
                  </TagSafeLink>
                </li>
              ))}
            </StyledUl>
          </nav>
        </>
      ) : null}
    </MyNdlaPageWrapper>
  );
};
