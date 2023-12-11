/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { FolderOutlined, FolderSharedOutlined } from '@ndla/icons/contentType';
import { ContentLoader } from '@ndla/ui';
import WhileLoading from '../../../components/WhileLoading';
import { GQLFolder } from '../../../graphqlTypes';
import MyNdlaBreadcrumb from '../components/MyNdlaBreadcrumb';
import MyNdlaTitle from '../components/MyNdlaTitle';
import TitleWrapper from '../components/TitleWrapper';

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.small};
`;

const IconCSS = css`
  height: ${spacing.large};
  width: ${spacing.large};
`;

interface Props {
  loading: boolean;
  selectedFolder: GQLFolder | null;
}

const FoldersPageTitle = ({ loading, selectedFolder }: Props) => {
  const { t } = useTranslation();

  return (
    <TitleWrapper>
      <WhileLoading
        isLoading={loading}
        fallback={
          !!selectedFolder && (
            <ContentLoader
              width={500}
              height={30}
              css={{ maxWidth: '500px', minWidth: '500px' }}
            >
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
        }
      >
        <MyNdlaBreadcrumb
          breadcrumbs={selectedFolder?.breadcrumbs ?? []}
          page="folders"
        />
      </WhileLoading>
      <TitleRow>
        <WhileLoading
          fallback={
            <ContentLoader
              width={500}
              height={selectedFolder ? 44 : 28}
              css={{ maxWidth: '500px', minWidth: '500px' }}
            >
              <rect
                x="0"
                y="2"
                rx="3"
                ry="3"
                width="300"
                height={selectedFolder ? '40' : '24'}
                key="rect-1"
              />
            </ContentLoader>
          }
          isLoading={loading}
        >
          {selectedFolder ? (
            selectedFolder.status === 'shared' ? (
              <FolderSharedOutlined css={IconCSS} />
            ) : (
              <FolderOutlined css={IconCSS} />
            )
          ) : null}
          <MyNdlaTitle title={selectedFolder?.name ?? t('myNdla.myFolders')} />
        </WhileLoading>
      </TitleRow>
    </TitleWrapper>
  );
};

export default memo(FoldersPageTitle);
