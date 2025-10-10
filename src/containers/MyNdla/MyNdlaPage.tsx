/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Feide, ArrowRightLine } from "@ndla/icons";
import { Button, DialogRoot, DialogTrigger, Heading, Text } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { HelmetWithTracker, useTracker } from "@ndla/tracker";
import { keyBy } from "@ndla/util";
import MyNdlaPageWrapper from "./components/MyNdlaPageWrapper";
import { AuthContext } from "../../components/AuthenticationContext";
import ListResource from "../../components/MyNdla/ListResource";
import LoginModalContent from "../../components/MyNdla/LoginModalContent";
import MyNdlaTitle, { TitleWrapper } from "../../components/MyNdla/MyNdlaTitle";
import SocialMediaMetadata from "../../components/SocialMediaMetadata";
import config from "../../config";
import { myndlaLanguages } from "../../i18n";
import {
  useFolderResourceMetaSearch,
  useFavouriteSubjects,
  useRecentlyUsedResources,
} from "../../mutations/folderMutations";
import { routes } from "../../routeHelpers";
import { getResourceTypesForResource } from "../../util/folderHelpers";
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

export const MyNdlaPage = () => {
  const { user, authContextLoaded, authenticated } = useContext(AuthContext);
  const { t } = useTranslation();
  const { trackPageView } = useTracker();
  const recentFavouriteSubjectsQuery = useFavouriteSubjects(user?.favoriteSubjects?.toReversed().slice(0, 4) ?? [], {
    skip: !user?.favoriteSubjects.length,
  });
  const { data: recentlyUsedResources } = useRecentlyUsedResources(!authenticated);
  const { data: metaData, loading } = useFolderResourceMetaSearch(
    recentlyUsedResources?.allFolderResources?.map((r) => ({
      id: r.resourceId,
      path: r.path,
      resourceType: r.resourceType,
    })) ?? [],
    {
      skip: !recentlyUsedResources?.allFolderResources.length,
    },
  );

  useEffect(() => {
    if (!authContextLoaded) return;
    trackPageView({
      title: t("htmlTitles.myNdlaPage"),
      dimensions: getAllDimensions({ user }),
    });
  }, [authContextLoaded, t, trackPageView, user]);

  const keyedData = keyBy(metaData ?? [], (r) => `${r.type}${r.id}`);

  // const aiLang = i18n.language === "nn" ? "" : ""; // TODO: Readd nn when Jan says so

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
      {!!recentFavouriteSubjectsQuery.data?.subjects?.length && (
        <SectionWrapper>
          <Heading asChild consumeCss textStyle="heading.small">
            <h2>{t("myNdla.favoriteSubjects.title")}</h2>
          </Heading>
          <GridList>
            {recentFavouriteSubjectsQuery.data.subjects.map((subject) => (
              <SubjectLink key={subject.id} favorites={user?.favoriteSubjects} subject={subject} />
            ))}
          </GridList>

          <SafeLink to={routes.myNdla.subjects}>
            {t("myNdla.myPage.favouriteSubjects.viewAll")}
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
      ) : recentlyUsedResources?.allFolderResources?.length ? (
        <SectionWrapper>
          <Heading asChild consumeCss textStyle="heading.small">
            <h2>{t("myNdla.myPage.recentFavourites.title")}</h2>
          </Heading>
          <StyledList>
            {recentlyUsedResources.allFolderResources.map((res) => {
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
                      src: meta?.metaImage?.url,
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

export const Component = MyNdlaPage;
