/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext, useEffect, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import keyBy from 'lodash/keyBy';
import styled from '@emotion/styled';
import { fonts, spacing } from '@ndla/core';
import { HeartOutline, MenuBook } from '@ndla/icons/action';
import { FolderOutlined } from '@ndla/icons/contentType';
import { Share } from '@ndla/icons/common';
import { CampaignBlock, ListResource } from '@ndla/ui';
import { HelmetWithTracker, useTracker } from '@ndla/tracker';
import { Text } from '@ndla/typography';
import InfoPart, { InfoPartIcon } from './InfoPart';
import { AuthContext } from '../../components/AuthenticationContext';
import {
  useFolderResourceMetaSearch,
  useRecentlyUsedResources,
} from './folderMutations';
import MyNdlaTitle from './components/MyNdlaTitle';
import TitleWrapper from './components/TitleWrapper';
import { isStudent } from './Folders/util';
import { getAllDimensions } from '../../util/trackingUtil';
import MyNdlaPageWrapper from './components/MyNdlaPageWrapper';
import { useAiOrgs } from './configQueries';
const ShareIcon = InfoPartIcon.withComponent(Share);
const HeartOutlineIcon = InfoPartIcon.withComponent(HeartOutline);
const FolderOutlinedIcon = InfoPartIcon.withComponent(FolderOutlined);
const FavoriteSubjectIcon = InfoPartIcon.withComponent(MenuBook);

const StyledPageContentContainer = styled.div`
  display: flex;
  flex-direction: column;
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

const StyledDescription = styled.p`
  line-height: 1.5;
  ${fonts.sizes('24px')};
`;

const StyledCampaignBlock = styled(CampaignBlock)`
  max-width: 100%;
  margin-bottom: ${spacing.normal};
`;

const MyNdlaPage = () => {
  const { user, authContextLoaded } = useContext(AuthContext);
  const { t, i18n } = useTranslation();
  const { trackPageView } = useTracker();
  const { allFolderResources } = useRecentlyUsedResources();
  const { data: aiData } = useAiOrgs();
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

  const keyedData = keyBy(metaData ?? [], (r) => `${r.type}${r.id}`);

  const aiLang = i18n.language === 'nn' ? 'nn' : '';

  const allowedAiOrgs = useMemo(() => {
    if (!aiData?.aiEnabledOrgs?.value) return [];
    return aiData?.aiEnabledOrgs.value;
  }, [aiData]);

  return (
    <MyNdlaPageWrapper>
      <StyledPageContentContainer>
        <HelmetWithTracker title={t('htmlTitles.myNdlaPage')} />
        <TitleWrapper>
          <MyNdlaTitle title={t('myNdla.myPage.myPage')} />
        </TitleWrapper>
        <StyledDescription>{t('myNdla.myPage.welcome')}</StyledDescription>
        {allowedAiOrgs.includes(user?.baseOrg?.displayName ?? '') && (
          <StyledCampaignBlock
            title={{
              title: t('myndla.campaignBlock.title'),
              language: i18n.language,
            }}
            headingLevel="h3"
            image={{
              src: '/static/ndla-ai.png',
              alt: '',
            }}
            imageSide="left"
            url={{
              url: `https://ai.ndla.no/${aiLang}`,
              text: t('myndla.campaignBlock.linkText'),
            }}
            description={{
              text: isStudent(user)
                ? t('myndla.campaignBlock.ingressStudent')
                : t('myndla.campaignBlock.ingress'),
              language: i18n.language,
            }}
          />
        )}
        <InfoPart icon={<ShareIcon />} title={t('myNdla.myPage.sharing.title')}>
          <Text textStyle="content-alt">{t('myNdla.myPage.sharing.text')}</Text>
        </InfoPart>
        <InfoPart
          icon={<HeartOutlineIcon />}
          title={t('myNdla.myPage.storageInfo.title')}
        >
          <Text textStyle="content-alt">
            {t('myNdla.myPage.storageInfo.text')}
          </Text>
        </InfoPart>
        <InfoPart
          icon={<FavoriteSubjectIcon />}
          title={t('myNdla.myPage.favoriteSubjects.title')}
        >
          <Text textStyle="content-alt">
            {t('myNdla.myPage.favoriteSubjects.text')}
          </Text>
        </InfoPart>
        <InfoPart
          icon={<FolderOutlinedIcon />}
          title={t('myNdla.myPage.folderInfo.title')}
        >
          <Text textStyle="content-alt">
            <Trans i18nKey="myNdla.myPage.folderInfo.text" />
          </Text>
        </InfoPart>
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
      </StyledPageContentContainer>
    </MyNdlaPageWrapper>
  );
};

export default MyNdlaPage;
