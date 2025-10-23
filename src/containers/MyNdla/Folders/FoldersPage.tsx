/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { useQuery } from "@apollo/client/react";
import { Heading } from "@ndla/primitives";
import { SafeLinkButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { HelmetWithTracker, useTracker } from "@ndla/tracker";
import { useFolderActions } from "./components/FolderActionHooks";
import FolderList from "./components/FolderList";
import ResourceList from "./components/ResourceList";
import { AuthContext } from "../../../components/AuthenticationContext";
import FoldersPageTitle from "../../../components/MyNdla/FoldersPageTitle";
import { GQLFolder, GQLFoldersPageQuery } from "../../../graphqlTypes";
import { foldersPageQuery, useFolder } from "../../../mutations/folder/folderQueries";
import { routes } from "../../../routeHelpers";
import { getAllTags } from "../../../util/folderHelpers";
import { getAllDimensions } from "../../../util/trackingUtil";
import PrivateRoute from "../../PrivateRoute/PrivateRoute";
import MyNdlaPageWrapper from "../components/MyNdlaPageWrapper";

const StyledMyNdlaPageWrapper = styled(MyNdlaPageWrapper, {
  base: {
    gap: "xsmall",
  },
});

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

const SharedHeading = styled(Heading, {
  base: {
    marginBlock: "xsmall",
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
  const { user, authContextLoaded, examLock } = useContext(AuthContext);
  const { trackPageView } = useTracker();
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

  const [previousFolders, setPreviousFolders] = useState<GQLFolder[]>(folders);
  const [focusId, setFocusId] = useState<string | undefined>(undefined);

  const resourceRefId = useMemo(
    () =>
      folders.length === 0 && selectedFolder?.resources.length === 1
        ? "languageSelectorFooter"
        : selectedFolder?.resources?.length !== 1
          ? undefined
          : `folder-${folders.slice(-1)[0]?.id}`,
    [folders, selectedFolder?.resources],
  );

  const folderRefId = useMemo(
    () =>
      folders.length === 1 && selectedFolder?.resources.length === 0
        ? "languageSelectorFooter"
        : folders.length !== 1
          ? undefined
          : `resource-${selectedFolder?.resources[0]?.id}`,
    [selectedFolder?.resources, folders],
  );

  useEffect(() => {
    if (!authContextLoaded) return;
    trackPageView({ title, dimensions: getAllDimensions({ user }) });
  }, [authContextLoaded, title, trackPageView, user]);

  useEffect(() => {
    const folderIds = folders.map((f) => f.id).sort();
    const prevFolderIds = previousFolders.map((f) => f.id).sort();
    const isEqual = folderIds.length === prevFolderIds.length && folderIds.every((v, i) => v === prevFolderIds[i]);
    if (!isEqual && focusId) {
      setTimeout(() => document.getElementById(`folder-${focusId}`)?.getElementsByTagName("a")?.[0]?.focus(), 0);
      setFocusId(undefined);
      setPreviousFolders(folders);
    } else if (!isEqual && folderIds.length === 1 && prevFolderIds?.length === 1) {
      const id = folders[0]?.id;
      if (id) {
        setTimeout(() => document.getElementById(`folder-${id}`)?.getElementsByTagName("a")?.[0]?.focus(), 0);
        setPreviousFolders(folders);
      }
    }
  }, [folders, focusId, previousFolders]);

  const menuItems = useFolderActions(selectedFolder, setFocusId, folders, true);

  const tags = useMemo(() => getAllTags(folders), [folders]);

  return (
    <StyledMyNdlaPageWrapper menuItems={menuItems} showButtons={!examLock || !!selectedFolder}>
      <HelmetWithTracker title={title} />
      <FoldersPageTitle key={selectedFolder?.id} loading={loading} selectedFolder={selectedFolder} />
      {!!selectedFolder && (
        <p>
          <StyledEm>{selectedFolder.description ?? t("myNdla.folder.defaultPageDescription")}</StyledEm>
        </p>
      )}
      <FolderList
        folders={folders}
        loading={loading}
        folderId={folderId}
        setFocusId={setFocusId}
        folderRefId={folderRefId}
      />
      {!!selectedFolder && <ResourceList selectedFolder={selectedFolder} resourceRefId={resourceRefId} />}
      {!selectedFolder && sharedByOthersFolders?.length > 0 && (
        <>
          <SharedHeading asChild consumeCss textStyle="heading.small">
            <h2>{t("myNdla.sharedByOthersFolders")}</h2>
          </SharedHeading>
          <FolderList
            folders={sharedByOthersFolders as unknown as GQLFolder[]}
            loading={loading}
            folderId={folderId}
            setFocusId={setFocusId}
            folderRefId={folderRefId}
            isFavorited={true}
          />
        </>
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
    </StyledMyNdlaPageWrapper>
  );
};
