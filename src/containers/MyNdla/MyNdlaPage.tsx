/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import keyBy from 'lodash/keyBy';
import styled from '@emotion/styled';
import { colors, fonts, spacing } from '@ndla/core';
import { ForwardArrow } from '@ndla/icons/action';
import SafeLink from '@ndla/safelink';
import { CampaignBlock, ListResource } from '@ndla/ui';
import { HelmetWithTracker, useTracker } from '@ndla/tracker';
import { Heading } from '@ndla/typography';
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
import { useRecentTopics } from './arenaQueries';
import TopicCard from './Arena/components/TopicCard';

const StyledPageContentContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledResourceList = styled.ul`
  padding: 0;
  display: flex;
  flex-direction: column;
  list-style: none;
  gap: ${spacing.xsmall};
  li {
    padding: 0px;
  }
`;

const SectionWrapper = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
`;

const StyledSafeLink = styled(SafeLink)`
  display: block;
  box-shadow: none;
  text-decoration: underline;
  color: ${colors.brand.primary};
  text-underline-offset: ${spacing.xsmall};
  svg {
    width: ${spacing.snormal};
    height: ${spacing.snormal};
    margin-left: ${spacing.xsmall};
  }
  &:focus-within,
  &:hover {
    text-decoration: none;
  }
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
  const recentArenaTopicsQuery = useRecentTopics({ skip: !user?.arenaEnabled });
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
        {allowedAiOrgs.includes(user?.organization ?? '') && (
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
        {allFolderResources && allFolderResources.length > 0 && (
          <SectionWrapper>
            <Heading element="h2" headingStyle="h2" margin="small">
              {t('myNdla.myPage.recentFavourites.title')}
            </Heading>
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
            <StyledSafeLink to="folders">
              {t('myNdla.myPage.recentFavourites.link')}
              <ForwardArrow />
            </StyledSafeLink>
          </SectionWrapper>
        )}
        {!!recentArenaTopicsQuery.data?.length && (
          <SectionWrapper>
            <Heading element="h2" headingStyle="h2" margin="small">
              {t('myNdla.myPage.recentArenaPosts.title')}
            </Heading>
            <StyledResourceList>
              {recentArenaTopicsQuery.data.slice(0, 5).map((topic) => (
                <li key={topic.id}>
                  <TopicCard
                    id={topic.id}
                    count={topic.postCount}
                    title={topic.title}
                    timestamp={topic.timestamp}
                    locked={topic.locked}
                  />
                </li>
              ))}
            </StyledResourceList>
            <StyledSafeLink to="arena">
              {t('myNdla.myPage.recentArenaPosts.link')}
              <ForwardArrow />
            </StyledSafeLink>
          </SectionWrapper>
        )}
      </StyledPageContentContainer>
    </MyNdlaPageWrapper>
  );
};

export default MyNdlaPage;
