/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import keyBy from "lodash/keyBy";
import { useContext, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Feide, ArrowRightLine } from "@ndla/icons";
import { Button, DialogRoot, DialogTrigger, Heading, Text } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { HelmetWithTracker, useTracker } from "@ndla/tracker";
import { CampaignBlock } from "@ndla/ui";
import { TopicListItem } from "./Arena/components/ArenaListItem";
import { useArenaRecentTopics } from "./Arena/components/temporaryNodebbHooks";
import MyNdlaPageWrapper from "./components/MyNdlaPageWrapper";
import MyNdlaTitle from "./components/MyNdlaTitle";
import TitleWrapper from "./components/TitleWrapper";
import { useFolderResourceMetaSearch, useFavouriteSubjects, useRecentlyUsedResources } from "./folderMutations";
import { isStudent } from "./Folders/util";
import { sortSubjectsByRecentlyFavourited } from "./myNdlaUtils";
import { AuthContext } from "../../components/AuthenticationContext";
import ListResource from "../../components/MyNdla/ListResource";
import LoginModalContent from "../../components/MyNdla/LoginModalContent";
import SocialMediaMetadata from "../../components/SocialMediaMetadata";
import config from "../../config";
import { myndlaLanguages } from "../../i18n";
import { routes } from "../../routeHelpers";
import { getResourceTypesForResource } from "../../util/folderHelpers";
import { getNdlaRobotDateFormat } from "../../util/formatDate";
import { getAllDimensions } from "../../util/trackingUtil";
import { GridList } from "../AllSubjectsPage/SubjectCategory";
import SubjectLink from "../AllSubjectsPage/SubjectLink";

const StyledList = styled("ul", {
  base: {
    listStyle: "none",
  },
});

const SectionWrapper = styled("section", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "medium",
  },
});

const StyledMyNdlaPageWrapper = styled(MyNdlaPageWrapper, {
  base: {
    gap: "xxlarge",
  },
});

const StyledText = styled(Text, {
  base: {
    maxWidth: "surface.contentMax",
  },
});

const StyledArrowRightLine = styled(ArrowRightLine, {
  base: {
    marginInlineStart: "xxsmall",
  },
});

const MyNdlaPage = () => {
  const { user, authContextLoaded, authenticated } = useContext(AuthContext);
  const { t, i18n } = useTranslation();
  const { trackPageView } = useTracker();
  const recentFavouriteSubjectsQuery = useFavouriteSubjects(user?.favoriteSubjects?.slice(0, 4) ?? [], {
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

  // const aiLang = i18n.language === "nn" ? "" : ""; // TODO: Readd nn when Jan says so

  const dateString = getNdlaRobotDateFormat(new Date());
  const token = btoa(dateString);
  const aiUrl = `https://ndla-ki.no/${token}`;

  return (
    <StyledMyNdlaPageWrapper>
      <HelmetWithTracker title={t("htmlTitles.myNdlaPage")} />
      <SocialMediaMetadata
        title={t("myNdla.myNDLA")}
        description={t("myNdla.description")}
        trackableContent={{ supportedLanguages: myndlaLanguages }}
        imageUrl={`${config.ndlaFrontendDomain}/static/ndla-ai.jpg`}
      />
      <TitleWrapper>
        <MyNdlaTitle title={t("myNdla.myNDLA")} />
        <StyledText textStyle="body.xlarge">
          {authenticated ? t("myNdla.myPage.welcome") : t("myNdla.myPage.loginPitch")}
        </StyledText>
      </TitleWrapper>
      {!authenticated && (
        <DialogRoot>
          <DialogTrigger asChild>
            <Button variant="primary" aria-label={t("myNdla.myPage.loginPitchButton")}>
              {t("myNdla.myPage.loginPitchButton")}
              <Feide />
            </Button>
          </DialogTrigger>
          <LoginModalContent masthead />
        </DialogRoot>
      )}
      <CampaignBlock
        title={t("myndla.campaignBlock.title")}
        headingLevel="h2"
        image={{
          src: "/static/ndla-ai.jpg",
          alt: "",
        }}
        imageSide="right"
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
      {!!recentFavouriteSubjectsQuery.data?.subjects?.length && (
        <SectionWrapper>
          <Heading asChild consumeCss textStyle="heading.small">
            <h2>{t("myNdla.favoriteSubjects.title")}</h2>
          </Heading>
          <GridList>
            {sortedSubjects.map((subject) => (
              <SubjectLink key={subject.id} favorites={user?.favoriteSubjects} subject={subject} />
            ))}
          </GridList>

          <SafeLink to={routes.myNdla.subjects}>
            {t("myNdla.myPage.favouriteSubjects.viewAll")}
            <StyledArrowRightLine />
          </SafeLink>
        </SectionWrapper>
      )}
      {!config.externalArena && !!recentArenaTopicsQuery.data?.items?.length && (
        <SectionWrapper>
          <Heading asChild consumeCss textStyle="heading.small">
            <h2>{t("myNdla.myPage.recentArenaPosts.title")}</h2>
          </Heading>
          <StyledList>
            {recentArenaTopicsQuery.data?.items?.map((topic) => (
              <li key={topic.id}>
                <TopicListItem
                  id={topic.id}
                  context="list"
                  postCount={topic.postCount}
                  voteCount={topic.voteCount}
                  title={topic.title}
                  timestamp={topic.created}
                />
              </li>
            ))}
          </StyledList>
          <SafeLink to="arena">
            {t("myNdla.myPage.recentArenaPosts.link")}
            <StyledArrowRightLine />
          </SafeLink>
        </SectionWrapper>
      )}
      {!authenticated ? (
        <>
          <SectionWrapper>
            <Heading asChild consumeCss>
              <h2>{t("myNdla.favoriteSubjects.title")}</h2>
            </Heading>
            <Text textStyle="body.large">{t("myNdla.myPage.favouriteSubjects.noFavorites")}</Text>
            <SafeLink to="/subjects">
              {t("myNdla.myPage.favouriteSubjects.search")}
              <StyledArrowRightLine />
            </SafeLink>
          </SectionWrapper>
          <SectionWrapper>
            <Heading asChild consumeCss textStyle="heading.small">
              <h2>{t("myNdla.myPage.recentFavourites.title")}</h2>
            </Heading>
            <Text textStyle="body.large">{t("myNdla.myPage.recentFavourites.unauthorized")}</Text>
            <SafeLink to="/search">
              {t("myNdla.myPage.recentFavourites.search")}
              <StyledArrowRightLine />
            </SafeLink>
          </SectionWrapper>
        </>
      ) : !!allFolderResources && allFolderResources?.length > 0 ? (
        <SectionWrapper>
          <Heading asChild consumeCss textStyle="heading.small">
            <h2>{t("myNdla.myPage.recentFavourites.title")}</h2>
          </Heading>
          <StyledList>
            {allFolderResources.map((res) => {
              const meta = keyedData[`${res.resourceType}${res.resourceId}`];
              return (
                <li key={res.id}>
                  <ListResource
                    context="list"
                    id={res.id}
                    isLoading={loading}
                    key={res.id}
                    link={res.path}
                    title={meta ? meta.title : t("myNdla.sharedFolder.resourceRemovedTitle")}
                    resourceImage={{
                      src: meta?.metaImage?.url ?? "",
                      alt: "",
                    }}
                    resourceTypes={getResourceTypesForResource(res.resourceType, meta?.resourceTypes, t)}
                  />
                </li>
              );
            })}
          </StyledList>
          <SafeLink to="folders">
            {t("myNdla.myPage.recentFavourites.link")}
            <StyledArrowRightLine />
          </SafeLink>
        </SectionWrapper>
      ) : null}
    </StyledMyNdlaPageWrapper>
  );
};

export default MyNdlaPage;
