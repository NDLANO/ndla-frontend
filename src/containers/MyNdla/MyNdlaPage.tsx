/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import keyBy from 'lodash/keyBy';
import styled from '@emotion/styled';
import { fonts, spacing } from '@ndla/core';
import { HeartOutline, MenuBook } from '@ndla/icons/action';
import { FolderOutlined } from '@ndla/icons/contentType';
import { Feide, Share } from '@ndla/icons/common';
import { BannerCard, ListResource } from '@ndla/ui';
import { ButtonV2 } from '@ndla/button';
import SafeLink, { SafeLinkButton } from '@ndla/safelink';
import { HelmetWithTracker, useTracker } from '@ndla/tracker';
import {
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  ModalTitle,
  Modal,
  ModalTrigger,
  ModalContent,
} from '@ndla/modal';
import config from '../../config';
import InfoPart, { InfoPartIcon, InfoPartText } from './InfoSection';
import { AuthContext } from '../../components/AuthenticationContext';
import {
  useFolderResourceMetaSearch,
  useRecentlyUsedResources,
} from './folderMutations';
import MyNdlaBreadcrumb from './components/MyNdlaBreadcrumb';
import MyNdlaTitle from './components/MyNdlaTitle';
import TitleWrapper from './components/TitleWrapper';
import { constructNewPath, toHref } from '../../util/urlHelper';
import { isStudent } from './Folders/util';
import { useBaseName } from '../../components/BaseNameContext';
import { useDeletePersonalData } from './userMutations';
import { getAllDimensions } from '../../util/trackingUtil';
import { UserInfo } from './components/UserInfo';
import ArenaCard from './ArenaCards/ArenaCard'; //Temp for å teste styling

const ShareIcon = InfoPartIcon.withComponent(Share);
const HeartOutlineIcon = InfoPartIcon.withComponent(HeartOutline);
const FolderOutlinedIcon = InfoPartIcon.withComponent(FolderOutlined);
const FeideIcon = InfoPartIcon.withComponent(Feide);
const FavoriteSubjectIcon = InfoPartIcon.withComponent(MenuBook);

const StyledPageContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: ${spacing.large};
  // Temp to force styling in bannercard
  div {
    max-width: 100%;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: ${spacing.small};
  justify-content: flex-end;
`;

const StyledResourceList = styled.ul`
  padding: 0;
  display: flex;
  margin: 0;
  flex-direction: column;
  gap: ${spacing.xsmall};
`;

const ListItem = styled.li`
  list-style: none;
  margin: 0;
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

const StyledDescription = styled.p`
  line-height: 1.5;
  ${fonts.sizes('24px')};
`;

const StyledBannerCard = styled(BannerCard)`
  max-width: 100%;
`;

const MyNdlaPage = () => {
  const { user, authContextLoaded } = useContext(AuthContext);
  const { t, i18n } = useTranslation();
  const basename = useBaseName();
  const location = useLocation();
  const { trackPageView } = useTracker();
  const { deletePersonalData } = useDeletePersonalData();
  const { allFolderResources } = useRecentlyUsedResources();
  const { data: metaData, loading } = useFolderResourceMetaSearch(
    allFolderResources?.map((r) => ({
      id: r.resourceId,
      path: r.path,
      resourceType: r.resourceType,
    })) ?? [],
    {
      skip: !allFolderResources || !allFolderResources.length,
    },
  );

  useEffect(() => {
    if (!authContextLoaded) return;
    trackPageView({
      title: t('htmlTitles.myNdlaPage'),
      dimensions: getAllDimensions({ user }),
    });
  }, [authContextLoaded, t, trackPageView, user]);

  const onDeleteAccount = async () => {
    await deletePersonalData();
    window.location.href = constructNewPath(
      `/logout?state=${toHref(location)}`,
      basename,
    );
  };

  const keyedData = keyBy(metaData ?? [], (r) => `${r.type}${r.id}`);

  const aiLang = i18n.language === 'nn' ? 'nn' : '';

  return (
    <StyledPageContentContainer>
      <HelmetWithTracker title={t('htmlTitles.myNdlaPage')} />
      <TitleWrapper>
        <MyNdlaBreadcrumb page="minndla" breadcrumbs={[]} backCrumb="minndla" />
        <MyNdlaTitle title={t('myNdla.myPage.myPage')} />
      </TitleWrapper>
      <StyledDescription>{t('myNdla.myPage.welcome')}</StyledDescription>
      {config.allowedAIOrgs.includes(user?.baseOrg?.displayName ?? '') && (
        <StyledBannerCard
          link={`https://ai.ndla.no/${aiLang}`}
          title={{
            title: t('myndla.campaignBlock.title'),
            lang: i18n.language,
          }}
          image={{
            imageSrc: '/static/ndla-ai.png',
            altText: '',
          }}
          linkText={{
            text: t('myndla.campaignBlock.linkText'),
            lang: i18n.language,
          }}
          content={{
            content: isStudent(user)
              ? t('myndla.campaignBlock.ingressStudent')
              : t('myndla.campaignBlock.ingress'),
            lang: i18n.language,
          }}
        />
      )}
      <InfoPart icon={<ShareIcon />} title={t('myNdla.myPage.sharing.title')}>
        <InfoPartText>{t('myNdla.myPage.sharing.text')}</InfoPartText>
      </InfoPart>
      <InfoPart
        icon={<HeartOutlineIcon />}
        title={t('myNdla.myPage.storageInfo.title')}
      >
        <InfoPartText>{t('myNdla.myPage.storageInfo.text')}</InfoPartText>
      </InfoPart>
      <InfoPart
        icon={<FavoriteSubjectIcon />}
        title={t('myNdla.myPage.favoriteSubjects.title')}
      >
        <InfoPartText>{t('myNdla.myPage.favoriteSubjects.text')}</InfoPartText>
      </InfoPart>
      <InfoPart
        icon={<FolderOutlinedIcon />}
        title={t('myNdla.myPage.folderInfo.title')}
      >
        <InfoPartText>
          <Trans i18nKey="myNdla.myPage.folderInfo.text" />
        </InfoPartText>
      </InfoPart>
      <ArenaCard //Temp for å teste styling
        id="123"
        cardType="ArenaCategory"
        title="Elektronikk "
        subText="Diskuter, del og samarbeid om alt innen elektronikkfagene"
        timestamp={'2023-10-05T10:00:00Z'}
        count={29}
      />
      <ArenaCard
        id="1"
        cardType="ArenaTopic"
        title="Åpent innlegg"
        subText="Kategori"
        timestamp={'7.1.2023'}
        count={10}
        locked={true}
      />
      <ArenaCard
        id="2"
        cardType="ArenaTopic"
        title="Låst innlegg"
        subText="Kategori"
        timestamp={'7.1.2023'}
        count={10}
      />
      {allFolderResources && allFolderResources.length > 0 && (
        <>
          <h2>{t('myNdla.myPage.newFavourite')}</h2>
          <StyledResourceList>
            {allFolderResources.map((res) => {
              const meta = keyedData[`${res.resourceType}${res.resourceId}`];
              return (
                <ListItem key={res.id}>
                  <ListResource
                    id={res.id}
                    tagLinkPrefix="/minndla/tags"
                    isLoading={loading}
                    key={res.id}
                    link={res.path}
                    title={meta?.title ?? ''}
                    resourceImage={{
                      src: meta?.metaImage?.url ?? '',
                      alt: '',
                    }}
                    tags={res.tags}
                    resourceTypes={meta?.resourceTypes ?? []}
                  />
                </ListItem>
              );
            })}
          </StyledResourceList>
        </>
      )}
      {user && (
        <InfoPart icon={<FeideIcon />} title={t('myNdla.myPage.feide')}>
          <UserInfo user={user} />
          <p>
            {t('user.wrongUserInfoDisclaimer')}
            <SafeLink to="https://feide.no/brukerstotte">
              feide.no/brukerstotte
            </SafeLink>
          </p>
        </InfoPart>
      )}
      <InfoContainer>
        <LinkText>
          {`${t('myNdla.myPage.read.read')} `}
          <SafeLink target="_blank" to={t('myNdla.myPage.privacyLink')}>
            {t('myNdla.myPage.privacy')}
          </SafeLink>
          {`${t('myNdla.myPage.read.our')}`}
        </LinkText>
        <LinkText>
          {`${t('myNdla.myPage.questions.question')} `}
          <ButtonV2
            variant="link"
            onClick={() => document.getElementById('zendesk')?.click()}
          >
            {t('myNdla.myPage.questions.ask')}
          </ButtonV2>
        </LinkText>
      </InfoContainer>
      <ButtonContainer>
        <SafeLinkButton
          variant="outline"
          reloadDocument
          to={`/logout?state=${toHref(location)}`}
        >
          {t('myNdla.myPage.logout')}
        </SafeLinkButton>
      </ButtonContainer>
      <ButtonContainer>
        {t('myNdla.myPage.wishToDelete')}
        <Modal>
          <ModalTrigger>
            <ButtonV2 colorTheme="danger" variant="outline">
              {t('myNdla.myPage.deleteAccount')}
            </ButtonV2>
          </ModalTrigger>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>{t('myNdla.myPage.deleteAccount')}</ModalTitle>
              <ModalCloseButton title={t('modal.closeModal')} />
            </ModalHeader>
            <ModalBody>
              <p>{t('myNdla.myPage.confirmDeleteAccount')}</p>
              <ButtonRow>
                <ModalCloseButton>
                  <ButtonV2 variant="outline">{t('cancel')}</ButtonV2>
                </ModalCloseButton>
                <ButtonV2
                  colorTheme="danger"
                  variant="outline"
                  onClick={onDeleteAccount}
                >
                  {t('myNdla.myPage.confirmDeleteAccountButton')}
                </ButtonV2>
              </ButtonRow>
            </ModalBody>
          </ModalContent>
        </Modal>
      </ButtonContainer>
    </StyledPageContentContainer>
  );
};

export default MyNdlaPage;
