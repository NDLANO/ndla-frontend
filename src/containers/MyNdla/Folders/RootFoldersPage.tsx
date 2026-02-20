/**
 * Copyright (c) 2026-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { Heading } from "@ndla/primitives";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../../components/AuthenticationContext";
import { MyNdlaTitle } from "../../../components/MyNdla/MyNdlaTitle";
import { PageSpinner } from "../../../components/PageSpinner";
import { PageTitle } from "../../../components/PageTitle";
import { GQLFolder, GQLRootFoldersPageQuery, GQLRootFoldersPageQueryVariables } from "../../../graphqlTypes";
import {
  foldersPageQueryFragment,
  myNdlaResourceFragment,
  sharedFoldersPageQueryFragment,
} from "../../../mutations/folder/folderFragments";
import { MyNdlaPageSection } from "../components/MyNdlaPageSection";
import { MyNdlaPageWrapper } from "../components/MyNdlaPageWrapper";
import { PageActions } from "../components/PageActions";
import { useFolderActions } from "./components/FolderActionHooks";
import { FolderList } from "./components/FolderList";
import { ResourceList } from "./components/ResourceList";
import { FOLDERS_HEADING_ID, RESOURCES_HEADING_ID, SHARED_FOLDERS_HEADING_ID } from "./util";

const rootFoldersPageQuery = gql`
  query rootFoldersPage {
    folders(includeSubfolders: true, includeResources: true) {
      folders {
        ...FoldersPageQueryFragment
      }
      sharedFolders {
        ...SharedFoldersPageQueryFragment
      }
    }
    myNdlaRootResources {
      ...MyNdlaResourceFragment
    }
  }
  ${foldersPageQueryFragment}
  ${sharedFoldersPageQueryFragment}
  ${myNdlaResourceFragment}
`;

const RootFoldersPage = () => {
  const { t } = useTranslation();
  const { examLock } = useContext(AuthContext);

  const pageQuery = useQuery<GQLRootFoldersPageQuery, GQLRootFoldersPageQueryVariables>(rootFoldersPageQuery);

  const menuItems = useFolderActions(null, undefined, true);

  if (pageQuery.loading) {
    return <PageSpinner />;
  }

  return (
    <MyNdlaPageWrapper>
      <PageTitle title={t("htmlTitles.myFavoritesPage")} />
      <MyNdlaTitle title={t("myNdla.myFavorites")} />
      <MyNdlaPageSection>
        <Heading asChild consumeCss textStyle="heading.small" id={FOLDERS_HEADING_ID} tabIndex={-1}>
          <h2>{t("myNdla.folder.folders")}</h2>
        </Heading>
        {!examLock && <PageActions actions={menuItems} />}
        <FolderList labelledBy={FOLDERS_HEADING_ID} folders={(pageQuery.data?.folders.folders ?? []) as GQLFolder[]} />
      </MyNdlaPageSection>
      <MyNdlaPageSection>
        <MyNdlaPageSection>
          <Heading asChild consumeCss textStyle="heading.small" id={RESOURCES_HEADING_ID} tabIndex={-1}>
            <h2>{t("myNdla.folder.resources")}</h2>
          </Heading>
          <ResourceList
            selectedFolder={undefined}
            resources={pageQuery.data?.myNdlaRootResources ?? []}
            labelledBy={RESOURCES_HEADING_ID}
          />
        </MyNdlaPageSection>
      </MyNdlaPageSection>
      <MyNdlaPageSection>
        <Heading asChild consumeCss textStyle="heading.small" id={SHARED_FOLDERS_HEADING_ID} tabIndex={-1}>
          <h2>{t("myNdla.sharedByOthersFolders")}</h2>
        </Heading>
        <FolderList
          labelledBy={SHARED_FOLDERS_HEADING_ID}
          folders={(pageQuery.data?.folders.sharedFolders ?? []) as unknown as GQLFolder[]}
          isFavorited
        />
      </MyNdlaPageSection>
    </MyNdlaPageWrapper>
  );
};

export const Component = RootFoldersPage;
