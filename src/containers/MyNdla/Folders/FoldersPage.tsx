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
import styled from "@emotion/styled";
import { breakpoints, mq, spacing } from "@ndla/core";
import { FileDocumentOutline } from "@ndla/icons/common";
import { HelmetWithTracker, useTracker } from "@ndla/tracker";
import { Heading } from "@ndla/typography";
import FolderActions from "./FolderActions";
import { ResourceCountContainer } from "./FolderAndResourceCount";
import FolderButtons from "./FolderButtons";
import FolderList from "./FolderList";
import FoldersPageTitle from "./FoldersPageTitle";
import ListViewOptions from "./ListViewOptions";
import ResourceList from "./ResourceList";
import { AuthContext } from "../../../components/AuthenticationContext";
import { STORED_RESOURCE_VIEW_SETTINGS } from "../../../constants";
import { GQLFolder, GQLFoldersPageQuery } from "../../../graphqlTypes";
import { useGraphQuery } from "../../../util/runQueries";
import { getAllDimensions } from "../../../util/trackingUtil";
import MyNdlaPageWrapper from "../components/MyNdlaPageWrapper";
import { foldersPageQuery, useFolder } from "../folderMutations";
import MyTags from "../Tags/MyTags";

const FoldersPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xsmall};
`;

const OptionsWrapper = styled.div`
  display: none;
  flex: 1;

  ${mq.range({ from: breakpoints.tablet })} {
    display: flex;
  }
`;

export const BlockWrapper = styled.ul`
  display: grid;
  gap: ${spacing.xsmall};
  margin: 0;
  margin-bottom: ${spacing.medium};
  padding: 0 0 0 ${spacing.medium};

  &[data-type="block"] {
    padding: 0;
    gap: ${spacing.normal};
    margin-top: ${spacing.normal};
    grid-template-columns: repeat(3, 1fr);

    ${mq.range({ until: breakpoints.wide })} {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  ${mq.range({ until: breakpoints.tablet })} {
    padding: 0;
  }

  &[data-no-padding="true"] {
    padding: 0;
  }
`;

export const ListItem = styled.li`
  overflow: hidden;
  list-style: none;
  width: 100%;
  padding: 0;
`;

const StyledRow = styled.div`
  margin: ${spacing.small} 0;
  gap: ${spacing.nsmall};
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const StyledEm = styled.em`
  white-space: pre-wrap;
`;

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

  const sharedFolders: GQLFolder[] = useMemo(
    () => (selectedFolder ? selectedFolder.subfolders : (data?.folders.sharedFolders as GQLFolder[]) ?? []),
    [selectedFolder, data?.folders],
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

  return (
    <MyNdlaPageWrapper
      dropDownMenu={dropDownMenu}
      buttons={folderButtons}
      viewType={viewType}
      onViewTypeChange={setViewType}
      showButtons={!examLock || !!selectedFolder}
    >
      <FoldersPageContainer>
        <HelmetWithTracker title={title} />
        <FoldersPageTitle key={selectedFolder?.id} loading={loading} selectedFolder={selectedFolder} />
        {selectedFolder && (
          <p>
            <StyledEm>{selectedFolder.description ?? t("myNdla.folder.defaultPageDescription")}</StyledEm>
          </p>
        )}
        <StyledRow>
          <OptionsWrapper>
            <ListViewOptions type={viewType} onTypeChange={setViewType} />
          </OptionsWrapper>
        </StyledRow>
        <FolderList
          type={viewType}
          folders={folders}
          loading={loading}
          folderId={folderId}
          setFocusId={setFocusId}
          folderRefId={folderRefId}
        />
        {!!selectedFolder?.resources.length && (
          <ResourceCountContainer>
            <FileDocumentOutline />
            <span>
              {t("myNdla.resources", {
                count: selectedFolder?.resources.length,
              })}
            </span>
          </ResourceCountContainer>
        )}
        {selectedFolder && (
          <ResourceList selectedFolder={selectedFolder} viewType={viewType} resourceRefId={resourceRefId} />
        )}
        {sharedFolders && (
          <>
            <Heading element="h2" headingStyle="h2" margin="none">
              {t("myNdla.sharedByOthersFolders")}
            </Heading>
            <FolderList
              type={viewType}
              folders={sharedFolders}
              loading={loading}
              folderId={folderId}
              setFocusId={setFocusId}
              folderRefId={folderRefId}
            />
            {!!selectedFolder?.resources.length && (
              <ResourceCountContainer>
                <FileDocumentOutline />
                <span>
                  {t("myNdla.resources", {
                    count: selectedFolder?.resources.length,
                  })}
                </span>
              </ResourceCountContainer>
            )}
            {selectedFolder && (
              <ResourceList selectedFolder={selectedFolder} viewType={viewType} resourceRefId={resourceRefId} />
            )}
          </>
        )}
        <MyTags />
      </FoldersPageContainer>
    </MyNdlaPageWrapper>
  );
};

export default FoldersPage;
