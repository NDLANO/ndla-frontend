/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { ContentLoader } from '@ndla/ui';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { Dispatch, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import MyNdlaBreadcrumb from '../components/MyNdlaBreadcrumb';
import MyNdlaTitle from '../components/MyNdlaTitle';
import TitleWrapper from '../components/TitleWrapper';
import FolderActions from './FolderActions';
import WhileLoading from '../../../components/WhileLoading';
import { GQLFolder } from '../../../graphqlTypes';
import { FolderAction } from './FoldersPage';
import { AuthContext } from '../../../components/AuthenticationContext';

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.small};
`;

interface Props {
  loading: boolean;
  hasSelectedFolder: boolean;
  selectedFolder: GQLFolder | null;
  setFolderAction: Dispatch<FolderAction | undefined>;
}

const FoldersPageTitle = ({
  loading,
  hasSelectedFolder,
  selectedFolder,
  setFolderAction,
}: Props) => {
  const { t } = useTranslation();
  const { examLock } = useContext(AuthContext);
  const crumbs = selectedFolder?.breadcrumbs ?? [];

  const backCrumb =
    crumbs.length > 1
      ? crumbs[crumbs.length - 2]!
      : crumbs.length === 1
      ? 'folders'
      : 'minndla';

  return (
    <TitleWrapper>
      <WhileLoading
        isLoading={loading}
        fallback={
          hasSelectedFolder && (
            <ContentLoader
              width={500}
              height={30}
              css={{ maxWidth: '500px', minWidth: '500px' }}>
              <rect
                x="0"
                y="2"
                rx="3"
                ry="3"
                width="400"
                height="25"
                key="rect-1"
              />
            </ContentLoader>
          )
        }>
        <MyNdlaBreadcrumb
          breadcrumbs={selectedFolder?.breadcrumbs ?? []}
          backCrumb={backCrumb}
          page="folders"
        />
      </WhileLoading>
      <TitleRow>
        <WhileLoading
          fallback={
            <ContentLoader
              width={500}
              height={hasSelectedFolder ? 44 : 28}
              css={{ maxWidth: '500px', minWidth: '500px' }}>
              <rect
                x="0"
                y="2"
                rx="3"
                ry="3"
                width="300"
                height={hasSelectedFolder ? '40' : '24'}
                key="rect-1"
              />
            </ContentLoader>
          }
          isLoading={loading}>
          <MyNdlaTitle title={selectedFolder?.name ?? t('myNdla.myFolders')} />
          {hasSelectedFolder && !examLock && (
            <FolderActions
              onActionChanged={action =>
                selectedFolder &&
                setFolderAction({ action, folder: selectedFolder })
              }
            />
          )}
        </WhileLoading>
      </TitleRow>
    </TitleWrapper>
  );
};

export default FoldersPageTitle;
