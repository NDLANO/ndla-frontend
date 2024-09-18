/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import isEqual from "lodash/isEqual";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Heading } from "@ndla/primitives";
import { SafeLinkButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { HelmetWithTracker, useTracker } from "@ndla/tracker";
import FolderActions from "./components/FolderActions";
import FolderButtons from "./components/FolderButtons";
import FolderList from "./components/FolderList";
import ListViewOptions from "./components/ListViewOptions";
import ResourceList from "./components/ResourceList";
import { AuthContext } from "../../../components/AuthenticationContext";
import FoldersPageTitle from "../../../components/MyNdla/FoldersPageTitle";
import { STORED_RESOURCE_VIEW_SETTINGS } from "../../../constants";
import { GQLFolder, GQLFoldersPageQuery } from "../../../graphqlTypes";
import { routes } from "../../../routeHelpers";
import { getAllTags } from "../../../util/folderHelpers";
import { useGraphQuery } from "../../../util/runQueries";
import { getAllDimensions } from "../../../util/trackingUtil";
import MyNdlaPageWrapper from "../components/MyNdlaPageWrapper";
import { foldersPageQuery, useFolder } from "../folderMutations";

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

export type ViewType = "list" | "block" | "listLarger";

const FoldersPage = () => {
  const { t } = useTranslation();
  const { folderId } = useParams();
  const { user, authContextLoaded, examLock } = useContext(AuthContext);
  const { trackPageView } = useTracker();
  const [viewType, _setViewType] = useState<ViewType>(
    (localStorage.getItem(STORED_RESOURCE_VIEW_SETTINGS) as ViewType) || "list",
  );
  const { data, loading } = useGraphQuery<GQLFoldersPageQuery>(foldersPageQuery);
  const selectedFolder = useFolder(folderId);

  const title = useMemo(() => {
    if (folderId) {
      return t("htmlTitles.myFolderPage", { folderName: selectedFolder?.name });
    } else return t("htmlTitles.myFoldersPage");
  }, [folderId, selectedFolder?.name, t]);

  const folders: GQLFolder[] = useMemo(
    () => (selectedFolder ? selectedFolder.subfolders : (data?.folders.folders as GQLFolder[]) ?? []),
    [selectedFolder, data?.folders],
  );
  const sharedByOthersFolders = useMemo(
    () => (!selectedFolder ? data?.folders.sharedFolders ?? [] : []),
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
    if (!isEqual(folderIds, prevFolderIds) && focusId) {
      setTimeout(() => document.getElementById(`folder-${focusId}`)?.getElementsByTagName("a")?.[0]?.focus(), 0);
      setFocusId(undefined);
      setPreviousFolders(folders);
    } else if (!isEqual(folderIds, prevFolderIds) && folderIds.length === 1 && prevFolderIds?.length === 1) {
      const id = folders[0]?.id;
      if (id) {
        setTimeout(() => document.getElementById(`folder-${id}`)?.getElementsByTagName("a")?.[0]?.focus(), 0);
        setPreviousFolders(folders);
      }
    }
  }, [folders, focusId, previousFolders]);

  const setViewType = useCallback((type: ViewType) => {
    _setViewType(type);
    localStorage.setItem(STORED_RESOURCE_VIEW_SETTINGS, type);
  }, []);

  const dropDownMenu = useMemo(
    () => <FolderActions selectedFolder={selectedFolder} setFocusId={setFocusId} folders={folders} inToolbar />,
    [selectedFolder, folders, setFocusId],
  );

  const folderButtons = useMemo(
    () => <FolderButtons selectedFolder={selectedFolder} setFocusId={setFocusId} />,
    [selectedFolder, setFocusId],
  );

  const tags = useMemo(() => getAllTags(folders), [folders]);

  return (
    <StyledMyNdlaPageWrapper
      dropDownMenu={dropDownMenu}
      buttons={folderButtons}
      showButtons={!examLock || !!selectedFolder}
    >
      <HelmetWithTracker title={title} />
      <FoldersPageTitle key={selectedFolder?.id} loading={loading} selectedFolder={selectedFolder} />
      {selectedFolder && (
        <p>
          <StyledEm>{selectedFolder.description ?? t("myNdla.folder.defaultPageDescription")}</StyledEm>
        </p>
      )}
      <ListViewOptions type={viewType} onTypeChange={setViewType} />
      <FolderList
        folders={folders}
        loading={loading}
        folderId={folderId}
        setFocusId={setFocusId}
        folderRefId={folderRefId}
      />
      {selectedFolder && (
        <ResourceList selectedFolder={selectedFolder} viewType={viewType} resourceRefId={resourceRefId} />
      )}
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
            <h2>{t("myndla.tagsTitle")}</h2>
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

export default FoldersPage;
