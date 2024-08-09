/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import format from "date-fns/format";
import keyBy from "lodash/keyBy";
import { useContext, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { colors, fonts, spacing } from "@ndla/core";
import { Feide, ArrowRightLine } from "@ndla/icons/common";
import { Button, DialogRoot, DialogTrigger } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { HelmetWithTracker, useTracker } from "@ndla/tracker";
import { Heading, Text } from "@ndla/typography";
import { CampaignBlock } from "@ndla/ui";
import { useArenaRecentTopics } from "./Arena/components/temporaryNodebbHooks";
import TopicCard from "./Arena/components/TopicCard";
import MyNdlaPageWrapper from "./components/MyNdlaPageWrapper";
import MyNdlaTitle from "./components/MyNdlaTitle";
import TitleWrapper from "./components/TitleWrapper";
import { useFolderResourceMetaSearch, useFavouriteSubjects, useRecentlyUsedResources } from "./folderMutations";
import { isStudent } from "./Folders/util";
import { sortSubjectsByRecentlyFavourited } from "./myNdlaUtils";
import { AuthContext } from "../../components/AuthenticationContext";
import ListResource from "../../components/MyNdla/ListResource";
import LoginModalContent from "../../components/MyNdla/LoginModalContent";
import { routes } from "../../routeHelpers";
import { getAllDimensions } from "../../util/trackingUtil";
import SubjectLink from "../AllSubjectsPage/SubjectLink";

const StyledPageContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.large};
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

const StyledTopicList = styled(StyledResourceList)`
  gap: 0px;
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
    width: 20px;
    height: 20px;
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

const LoginButton = styled(Button)`
  align-self: center;
  margin-block: ${spacing.normal} ${spacing.large};
`;

const StyledCampaignBlock = styled(CampaignBlock)`
  max-width: 100%;
`;

const StyledText = styled(Text)`
  font-weight: ${fonts.weight.normal};
`;

const StyledUl = styled.ul`
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
`;

const StyledSubjectLink = styled(SubjectLink)`
  padding: 0;
  border-radius: 2px;
  width: 100%;
`;

const MyNdlaPage = () => {
  const { user, authContextLoaded, authenticated } = useContext(AuthContext);
  const { t, i18n } = useTranslation();
  const { trackPageView } = useTracker();
  const recentFavouriteSubjectsQuery = useFavouriteSubjects(user?.favoriteSubjects.slice(0, 4) ?? [], {
    skip: !user?.favoriteSubjects.length,
  });
  const { allFolderResources } = useRecentlyUsedResources(!authenticated);
  const recentArenaTopicsQuery = useArenaRecentTopics(!user?.arenaEnabled, 5);
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

  const sortedSubjects = useMemo(() => {
    return sortSubjectsByRecentlyFavourited(
      recentFavouriteSubjectsQuery.data?.subjects ?? [],
      user?.favoriteSubjects ?? [],
    );
  }, [recentFavouriteSubjectsQuery.data?.subjects, user?.favoriteSubjects]);

  useEffect(() => {
    if (!authContextLoaded) return;
    trackPageView({
      title: t("htmlTitles.myNdlaPage"),
      dimensions: getAllDimensions({ user }),
    });
  }, [authContextLoaded, t, trackPageView, user]);

  const keyedData = keyBy(metaData ?? [], (r) => `${r.type}${r.id}`);

  const aiLang = i18n.language === "nn" ? "nn" : "";

  const dateString = format(new Date(), "Y-MM-dd HH:mm:ss");
  const token = btoa(dateString);
  const aiUrl =
    user?.organization === "Rogaland fylkeskommune" ? `https://ndlarobot.org/${token}` : `https://ai.ndla.no/${aiLang}`;

  return (
    <MyNdlaPageWrapper>
      <StyledPageContentContainer>
        <HelmetWithTracker title={t("htmlTitles.myNdlaPage")} />
        <div>
          <TitleWrapper>
            <MyNdlaTitle title={t("myNdla.myNDLA")} />
          </TitleWrapper>
          <StyledText margin="small" textStyle="label-large">
            {authenticated ? t("myNdla.myPage.welcome") : t("myNdla.myPage.loginPitch")}
          </StyledText>
        </div>
        {!authenticated && (
          <DialogRoot>
            <DialogTrigger asChild>
              <LoginButton variant="primary" aria-label={t("myNdla.myPage.loginPitchButton")}>
                {t("myNdla.myPage.loginPitchButton")}
                <Feide />
              </LoginButton>
            </DialogTrigger>
            <LoginModalContent masthead />
          </DialogRoot>
        )}
        <StyledCampaignBlock
          title={t("myndla.campaignBlock.title")}
          headingLevel="h2"
          image={{
            src: "/static/ndla-ai.png",
            alt: "",
          }}
          imageSide="left"
          url={{
            url: authenticated ? aiUrl : undefined,
            text: authenticated ? t("myndla.campaignBlock.linkText") : undefined,
          }}
          description={
            !authenticated
              ? t("myndla.campaignBlock.ingressUnauthenticated")
              : isStudent(user)
                ? t("myndla.campaignBlock.ingressStudent")
                : t("myndla.campaignBlock.ingress")
          }
        />
        {!!recentArenaTopicsQuery.data?.items?.length && (
          <SectionWrapper>
            <Heading element="h2" headingStyle="h2" margin="small">
              {t("myNdla.myPage.recentArenaPosts.title")}
            </Heading>
            <StyledTopicList>
              {recentArenaTopicsQuery.data?.items?.map((topic) => (
                <li key={topic.id}>
                  <TopicCard id={topic.id} count={topic.postCount} title={topic.title} timestamp={topic.created} />
                </li>
              ))}
            </StyledTopicList>
            <StyledSafeLink to="arena">
              {t("myNdla.myPage.recentArenaPosts.link")}
              <ArrowRightLine />
            </StyledSafeLink>
          </SectionWrapper>
        )}
        {!!recentFavouriteSubjectsQuery.data?.subjects?.length && (
          <SectionWrapper>
            <Heading element="h2" headingStyle="h2" margin="none">
              {t("myNdla.favoriteSubjects.title")}
            </Heading>
            <StyledUl>
              {sortedSubjects.map((subject) => (
                <StyledSubjectLink key={subject.id} favorites={user?.favoriteSubjects} subject={subject} />
              ))}
            </StyledUl>

            <StyledSafeLink to={routes.myNdla.subjects}>
              {t("myNdla.myPage.favouriteSubjects.viewAll")}
              <ArrowRightLine />
            </StyledSafeLink>
          </SectionWrapper>
        )}
        {!authenticated ? (
          <>
            <SectionWrapper>
              <Heading element="h2" headingStyle="h2" margin="small">
                {t("myNdla.favoriteSubjects.title")}
              </Heading>
              <Text margin="none" textStyle="content-alt">
                {t("myNdla.myPage.favouriteSubjects.noFavorites")}
              </Text>
              <StyledSafeLink to="/subjects">
                {t("myNdla.myPage.favouriteSubjects.search")}
                <ArrowRightLine />
              </StyledSafeLink>
            </SectionWrapper>
            <SectionWrapper>
              <Heading element="h2" headingStyle="h2" margin="small">
                {t("myNdla.myPage.recentFavourites.title")}
              </Heading>
              <Text margin="none" textStyle="content-alt">
                {t("myNdla.myPage.recentFavourites.unauthorized")}
              </Text>
              <StyledSafeLink to="/search">
                {t("myNdla.myPage.recentFavourites.search")}
                <ArrowRightLine />
              </StyledSafeLink>
            </SectionWrapper>
          </>
        ) : !!allFolderResources && allFolderResources?.length > 0 ? (
          <SectionWrapper>
            <Heading element="h2" headingStyle="h2" margin="small">
              {t("myNdla.myPage.recentFavourites.title")}
            </Heading>
            <StyledResourceList>
              {allFolderResources.map((res) => {
                const meta = keyedData[`${res.resourceType}${res.resourceId}`];
                return (
                  <ListItem key={res.id}>
                    <ListResource
                      id={res.id}
                      isLoading={loading}
                      key={res.id}
                      link={res.path}
                      title={meta ? meta.title : t("myNdla.sharedFolder.resourceRemovedTitle")}
                      resourceImage={{
                        src: meta?.metaImage?.url ?? "",
                        alt: "",
                      }}
                      resourceTypes={meta?.resourceTypes ?? []}
                    />
                  </ListItem>
                );
              })}
            </StyledResourceList>
            <StyledSafeLink to="folders">
              {t("myNdla.myPage.recentFavourites.link")}
              <ArrowRightLine />
            </StyledSafeLink>
          </SectionWrapper>
        ) : null}
      </StyledPageContentContainer>
    </MyNdlaPageWrapper>
  );
};

export default MyNdlaPage;
