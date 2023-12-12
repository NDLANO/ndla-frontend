/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { FileDocumentOutline, Share } from '@ndla/icons/common';
import { FolderOutlined } from '@ndla/icons/contentType';
import { ContentLoader } from '@ndla/ui';
import WhileLoading from '../../../components/WhileLoading';
import { GQLFolder } from '../../../graphqlTypes';
import { getTotalCountForFolder } from '../../../util/folderHelpers';

export const ResourceCountContainer = styled.div`
  display: flex;
  gap: ${spacing.xsmall};
  align-items: center;
`;

interface Props {
  selectedFolder: GQLFolder | null;
  hasSelectedFolder: boolean;
  folders?: GQLFolder[];
  folderData: GQLFolder[] | undefined;
  loading: boolean;
}

const CountLoadingShimmer = () => {
  return (
    <ContentLoader
      width={75}
      height={15}
      preserveAspectRatio={'none'}
      css={{
        maxWidth: '75px',
        minWidth: '75px',
        maxHeight: '15px',
      }}
    >
      <rect x="0" y="3" rx="3" ry="3" width="75" height="15" key="rect-1" />
    </ContentLoader>
  );
};

const FolderAndResourceCount = ({
  folders,
  selectedFolder,
  hasSelectedFolder,
  folderData,
  loading,
}: Props) => {
  const { t } = useTranslation();
  const allFoldersCount = useMemo(() => {
    return (
      folderData?.reduce((acc, curr) => {
        return acc + getTotalCountForFolder(curr).folders;
      }, folderData.length ?? 0) ?? 0
    );
  }, [folderData]);

  const selectedFolderCount = useMemo(
    () => (selectedFolder ? getTotalCountForFolder(selectedFolder) : undefined),
    [selectedFolder],
  );

  return (
    <>
      <ResourceCountContainer>
        {selectedFolder?.status === 'shared' && (
          <>
            <Share />
            <span>{t('myNdla.folder.sharing.shared')}</span>
          </>
        )}
        {folders && (
          <>
            <FolderOutlined />
            <span>
              <WhileLoading
                isLoading={loading}
                fallback={<CountLoadingShimmer />}
              >
                {t('myNdla.folders', {
                  count: hasSelectedFolder
                    ? selectedFolderCount?.folders
                    : allFoldersCount,
                })}
              </WhileLoading>
            </span>
          </>
        )}
        {hasSelectedFolder && (
          <>
            <FileDocumentOutline />
            <span>
              <WhileLoading
                isLoading={loading}
                fallback={<CountLoadingShimmer />}
              >
                {t('myNdla.resources', {
                  count: selectedFolderCount?.resources ?? allFoldersCount,
                })}
              </WhileLoading>
            </span>
          </>
        )}
      </ResourceCountContainer>
    </>
  );
};

export default FolderAndResourceCount;
