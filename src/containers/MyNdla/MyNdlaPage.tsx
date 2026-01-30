/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext, useId } from "react";
import { useTranslation } from "react-i18next";
import { Feide, ArrowRightLine } from "@ndla/icons";
import { Button, DialogRoot, DialogTrigger, Heading, Text } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { keyBy } from "@ndla/util";
import { MyNdlaPageWrapper } from "./components/MyNdlaPageWrapper";
import { AuthContext } from "../../components/AuthenticationContext";
import { ListResource } from "../../components/MyNdla/ListResource";
import { LoginModalContent } from "../../components/MyNdla/LoginModalContent";
import { MyNdlaTitle } from "../../components/MyNdla/MyNdlaTitle";
import { PageTitle } from "../../components/PageTitle";
import { SocialMediaMetadata } from "../../components/SocialMediaMetadata";
import config from "../../config";
import { myndlaLanguages } from "../../i18n";
import {
  useFolderResourceMetaSearch,
  useFavouriteSubjects,
  useRecentlyFavoritedResources,
} from "../../mutations/folder/folderQueries";
import { routes } from "../../routeHelpers";
import { GridList } from "../AllSubjectsPage/SubjectCategory";
import { SubjectLink } from "../AllSubjectsPage/SubjectLink";
import { MyNdlaPageSection, MyNdlaPageContent } from "./components/MyNdlaPageSection";

const StyledList = styled("ul", {
  base: {
    listStyle: "none",
    display: "flex",
    flexDirection: "column",
    gap: "xxsmall",
    width: "100%",
  },
});

const StyledArrowRightLine = styled(ArrowRightLine, {
  base: {
    marginInlineStart: "xxsmall",
  },
});

export const MyNdlaPage = () => {
  const { user, authenticated } = useContext(AuthContext);
  const { t } = useTranslation();
  const favoriteSubjectsHeadingId = useId();
  const recentlyFavoritedHeadingId = useId();

  const recentFavouriteSubjectsQuery = useFavouriteSubjects(user?.favoriteSubjects?.toReversed().slice(0, 4) ?? [], {
    skip: !user?.favoriteSubjects.length,
  });
  const recentlyFavoritedQuery = useRecentlyFavoritedResources(!authenticated);
  const { data: metaData, loading } = useFolderResourceMetaSearch(
    recentlyFavoritedQuery.data?.recentlyFavoritedResources?.map((r) => ({
      id: r.resourceId,
      path: r.path,
      resourceType: r.resourceType,
    })) ?? [],
    { skip: !recentlyFavoritedQuery.data?.recentlyFavoritedResources.length },
  );

  const keyedData = keyBy(metaData ?? [], (r) => `${r.type}${r.id}`);

  // const aiLang = i18n.language === "nn" ? "" : ""; // TODO: Readd nn when Jan says so

  return (
    <MyNdlaPageWrapper>
      <PageTitle title={t("htmlTitles.myNdlaPage")} />
      <SocialMediaMetadata
        title={t("myNdla.myNDLA")}
        description={t("myNdla.description")}
        trackableContent={{ supportedLanguages: myndlaLanguages }}
        imageUrl={`${config.ndlaFrontendDomain}/static/ndla-ai.jpg`}
      />
      <MyNdlaPageContent>
        <MyNdlaTitle title={t("myNdla.myNDLA")} />
        <Text textStyle="body.xlarge">
          {authenticated ? t("myNdla.myPage.welcome") : t("myNdla.myPage.loginPitch")}
        </Text>
      </MyNdlaPageContent>
      {!!recentFavouriteSubjectsQuery.data?.subjects?.length && (
        <MyNdlaPageSection>
          <Heading asChild consumeCss textStyle="heading.small" id={favoriteSubjectsHeadingId}>
            <h2>{t("myNdla.favoriteSubjects.title")}</h2>
          </Heading>
          <GridList aria-labelledby={favoriteSubjectsHeadingId}>
            {recentFavouriteSubjectsQuery.data.subjects.map((subject) => (
              <SubjectLink key={subject.id} favorites={user?.favoriteSubjects} subject={subject} />
            ))}
          </GridList>

          <SafeLink to={routes.myNdla.subjects}>
            {t("myNdla.myPage.favouriteSubjects.viewAll")}
            <StyledArrowRightLine />
          </SafeLink>
        </MyNdlaPageSection>
      )}
      {!authenticated ? (
        <>
          <DialogRoot>
            <DialogTrigger asChild>
              <Button variant="primary" aria-label={t("myNdla.myPage.loginPitchButton")}>
                {t("myNdla.myPage.loginPitchButton")}
                <Feide />
              </Button>
            </DialogTrigger>
            <LoginModalContent masthead />
          </DialogRoot>
          <MyNdlaPageSection>
            <Heading asChild consumeCss>
              <h2>{t("myNdla.favoriteSubjects.title")}</h2>
            </Heading>
            <Text textStyle="body.large">{t("myNdla.myPage.favouriteSubjects.noFavorites")}</Text>
            <SafeLink to="/subjects">
              {t("myNdla.myPage.favouriteSubjects.search")}
              <StyledArrowRightLine />
            </SafeLink>
          </MyNdlaPageSection>
          <MyNdlaPageSection>
            <Heading asChild consumeCss textStyle="heading.small">
              <h2>{t("myNdla.myPage.recentFavourites.title")}</h2>
            </Heading>
            <Text textStyle="body.large">{t("myNdla.myPage.recentFavourites.unauthorized")}</Text>
            <SafeLink to="/search">
              {t("myNdla.myPage.recentFavourites.search")}
              <StyledArrowRightLine />
            </SafeLink>
          </MyNdlaPageSection>
        </>
      ) : recentlyFavoritedQuery?.data?.recentlyFavoritedResources?.length ? (
        <MyNdlaPageSection>
          <Heading asChild consumeCss textStyle="heading.small" id={recentlyFavoritedHeadingId}>
            <h2>{t("myNdla.myPage.recentFavourites.title")}</h2>
          </Heading>
          <StyledList aria-labelledby={recentlyFavoritedHeadingId}>
            {recentlyFavoritedQuery.data.recentlyFavoritedResources.map((res) => {
              const meta = keyedData[`${res.resourceType}${res.resourceId}`];
              return (
                <li key={res.id}>
                  <ListResource
                    id={res.id}
                    isLoading={loading}
                    key={res.id}
                    link={res.path}
                    title={meta ? meta.title : t("myNdla.sharedFolder.resourceRemovedTitle")}
                    resourceImage={{
                      src: meta?.metaImage?.url,
                      alt: "",
                    }}
                    traits={meta?.__typename === "ArticleFolderResourceMeta" ? meta.traits : undefined}
                    resourceTypes={meta?.resourceTypes}
                    storedResourceType={res.resourceType}
                  />
                </li>
              );
            })}
          </StyledList>
          <SafeLink to="folders">
            {t("myNdla.myPage.recentFavourites.link")}
            <StyledArrowRightLine />
          </SafeLink>
        </MyNdlaPageSection>
      ) : null}
    </MyNdlaPageWrapper>
  );
};

export const Component = MyNdlaPage;
