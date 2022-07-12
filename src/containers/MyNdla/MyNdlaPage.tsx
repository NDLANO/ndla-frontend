/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { keyBy } from 'lodash';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { HeartOutline } from '@ndla/icons/action';
import { FolderOutlined } from '@ndla/icons/contentType';
import { Feide, HashTag, InformationOutline } from '@ndla/icons/common';
import { ListResource, UserInfo, Image } from '@ndla/ui';
import Button, { DeleteButton } from '@ndla/button';
import SafeLink, { SafeLinkButton } from '@ndla/safelink';
import InfoPart, { InfoPartIcon, InfoPartText } from './InfoSection';
import { AuthContext } from '../../components/AuthenticationContext';
import { useGraphQuery } from '../../util/runQueries';
import { GQLRecentlyUsedQuery } from '../../graphqlTypes';
import {
  recentlyUsedQuery,
  useFolderResourceMetaSearch,
} from './folderMutations';
import TermsOfService from '../../components/MyNdla/TermsOfService';

const HeartOutlineIcon = InfoPartIcon.withComponent(HeartOutline);
const FolderOutlinedIcon = InfoPartIcon.withComponent(FolderOutlined);
const HashTagIcon = InfoPartIcon.withComponent(HashTag);
const FeideIcon = InfoPartIcon.withComponent(Feide);
const TermsIcon = InfoPartIcon.withComponent(InformationOutline);

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
  min-width: 160px;
  object-fit: cover;
`;

const StyledResourceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xsmall};
`;

const LinkText = styled.p`
  margin: 0;
`;

const InfoContainer = styled.div`
  display: flex;
  padding: ${spacing.medium} 0;
  flex-direction: column;
  gap: ${spacing.small};
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: baseline;
  flex-direction: column;
  gap: ${spacing.xsmall};
  padding-bottom: ${spacing.normal};
`;

const MyNdlaPage = () => {
  const { user } = useContext(AuthContext);
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { data: { allFolderResources = [] } = {} } = useGraphQuery<
    GQLRecentlyUsedQuery
  >(recentlyUsedQuery);
  const { data: metaData } = useFolderResourceMetaSearch(
    allFolderResources.map(r => ({
      id: r.resourceId,
      path: r.path,
      resourceType: r.resourceType,
    })),
    {
      skip: !allFolderResources.length,
    },
  );

  const keyedData = keyBy(metaData ?? [], r => `${r.type}${r.id}`);

  return (
    <StyledPageContentContainer>
      <h1>{t('myNdla.myPage.myPage')}</h1>
      <StyledIntroContainer>
        <h2>{t('myNdla.myPage.welcome')}</h2>
        <RoundedImage src="/static/my-ndla-login.png" alt="alt" />
      </StyledIntroContainer>
      <h2>{t('myNdla.myPage.newFavourite')}</h2>
      {allFolderResources.length > 0 && (
        <StyledResourceList>
          {allFolderResources.map(res => {
            const meta = keyedData[`${res.resourceType}${res.resourceId}`];
            return (
              <ListResource
                key={res.id}
                link={res.path}
                title={meta?.title ?? ''}
                resourceImage={{
                  src: meta?.metaImage?.url ?? '',
                  alt: meta?.metaImage?.alt ?? '',
                }}
                tags={res.tags}
                topics={meta?.resourceTypes.map(rt => rt.name) ?? []}
              />
            );
          })}
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
      <InfoPart
        icon={<TermsIcon />}
        title={'myNdla.myPage.terms'}
        children={<TermsOfService />}
      />
      <InfoContainer>
        <LinkText>
          {`${t('myNdla.myPage.read.our')} `}
          <SafeLink target="_blank" to="https://om.ndla.no/gdpr">
            {t('myNdla.myPage.privacy')}
          </SafeLink>
        </LinkText>
        <LinkText>
          {`${t('myNdla.myPage.questions.question')} `}
          <Button
            link
            onClick={() => document.getElementById('zendesk')?.click()}>
            {t('myNdla.myPage.questions.ask')}
          </Button>
        </LinkText>
      </InfoContainer>
      <ButtonContainer>
        <SafeLinkButton
          outline
          to={'/logout'}
          onClick={e => {
            e.preventDefault();
            localStorage.setItem('lastPath', location.pathname);
            navigate('/logout');
          }}>
          {t('myNdla.myPage.logout')}
        </SafeLinkButton>
      </ButtonContainer>
      <ButtonContainer>
        {t('myNdla.myPage.wishToDelete')}
        <DeleteButton>{t('myNdla.myPage.deleteAccount')}</DeleteButton>
      </ButtonContainer>
    </StyledPageContentContainer>
  );
};

export default MyNdlaPage;
