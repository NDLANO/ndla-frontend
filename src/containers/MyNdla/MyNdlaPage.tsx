/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { gql } from '@apollo/client';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { HeartOutline } from '@ndla/icons/action';
import { FolderOutlined } from '@ndla/icons/contentType';
import { Feide, HashTag } from '@ndla/icons/common';
import { ListResource, UserInfo, Image } from '@ndla/ui';
import InfoPart, { InfoPartIcon, InfoPartText } from './InfoSection';
import { AuthContext } from '../../components/AuthenticationContext';
import { useGraphQuery } from '../../util/runQueries';
import { GQLRecentlyUsedQuery } from '../../graphqlTypes';

const HeartOutlineIcon = InfoPartIcon.withComponent(HeartOutline);
const FolderOutlinedIcon = InfoPartIcon.withComponent(FolderOutlined);
const HashTagIcon = InfoPartIcon.withComponent(HashTag);
const FeideIcon = InfoPartIcon.withComponent(Feide);

const StyledPageContentContainer = styled.div`
  padding-left: ${spacing.large};
  padding-right: 200px;
  display: flex;
  flex-direction: column;
`;

const StyledIntroContainer = styled.div`
  display: flex;
  gap: ${spacing.large};
`;

const RoundedImage = styled(Image)`
  border-radius: 50%;
  height: 160px;
  max-width: 160px;
`;

const StyledResourceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xsmall};
`;

const recentlyUsedQuery = gql`
  query recentlyUsed {
    allFolderResources(size: 5) {
      id
      path
      tags
      resourceType
    }
  }
`;

const MyNdlaPage = () => {
  const { user } = useContext(AuthContext);
  const { t } = useTranslation();
  const { data } = useGraphQuery<GQLRecentlyUsedQuery>(recentlyUsedQuery);
  return (
    <StyledPageContentContainer>
      <h1>{t('myNdla.myPage.myPage')}</h1>
      <StyledIntroContainer>
        <h2>{t('myNdla.myPage.welcome')}</h2>
        <RoundedImage
          src="https://api.test.ndla.no/image-api/raw/ta88f8e2.jpg"
          alt="alt"
        />
      </StyledIntroContainer>
      <h2>{t('myNdla.myPage.newFavourite')}</h2>
      {data?.allFolderResources && data.allFolderResources.length > 0 && (
        <StyledResourceList>
          {data?.allFolderResources.map(res => (
            <ListResource
              link={res.path}
              title={res.id}
              resourceImage={{ src: '', alt: '' }}
              tags={res.tags}
              topics={[res.resourceType]}
            />
          ))}
        </StyledResourceList>
      )}
      <InfoPart
        icon={<HeartOutlineIcon />}
        title={t('myNdla.myPage.storageInfo.title')}
        children={
          <InfoPartText>{t('myNdla.myPage.storageInfo.text')}</InfoPartText>
        }
      />
      <InfoPart
        icon={<FolderOutlinedIcon />}
        title={t('myNdla.myPage.folderInfo.title')}
        children={
          <InfoPartText>{t('myNdla.myPage.folderInfo.text')}</InfoPartText>
        }
      />
      <InfoPart
        icon={<HashTagIcon />}
        title={t('myNdla.myPage.tagInfo.title')}
        children={
          <InfoPartText>{t('myNdla.myPage.tagInfo.text')}</InfoPartText>
        }
      />
      {user && (
        <InfoPart
          icon={<FeideIcon />}
          title={t('myNdla.myPage.feide')}
          children={<UserInfo user={user} />}
        />
      )}
    </StyledPageContentContainer>
  );
};

export default MyNdlaPage;
