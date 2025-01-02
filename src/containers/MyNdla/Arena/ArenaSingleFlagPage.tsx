/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { Navigate, useParams } from "react-router-dom";
import { Heading, Text } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { HelmetWithTracker } from "@ndla/tracker";
import Flags from "./components/FlagCard";
import FlaggedPostCard from "./components/FlaggedPostCard";
import { PageSpinner } from "../../../components/PageSpinner";
import { routes } from "../../../routeHelpers";
import { useArenaPostInContext } from "../arenaQueries";
import MyNdlaBreadcrumb from "../components/MyNdlaBreadcrumb";
import MyNdlaPageWrapper from "../components/MyNdlaPageWrapper";

const StyledList = styled("ul", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "3xsmall",
  },
});

const ArenaSingleFlagPage = () => {
  const { postId } = useParams();
  const { t } = useTranslation();
  const { topic, loading } = useArenaPostInContext({
    variables: {
      postId: Number(postId),
      pageSize: 1,
    },
    skip: !Number(postId),
  });

  if (loading) return <PageSpinner />;

  const flaggedPost = topic?.posts?.items[0];

  if (!postId || !topic || !flaggedPost) return <Navigate to={"/404"} replace />;

  return (
    <MyNdlaPageWrapper>
      <HelmetWithTracker title={t("htmlTitles.arenaAdminPage")} />
      <MyNdlaBreadcrumb
        breadcrumbs={[
          {
            name: t("myNdla.arena.admin.flags.title"),
            id: `flags`,
          },
          {
            name: t("myNdla.arena.admin.flags.singleFlagTitle", { postId }),
            id: "flags/singleFlag",
          },
        ]}
        page="admin"
      />
      <Heading textStyle="heading.medium">{t("myNdla.arena.admin.flags.singleFlagTitle", { postId })}</Heading>
      <Text>{t("myNdla.arena.admin.flags.singleFlagDescription")}</Text>
      <Text>
        {t("myNdla.arena.admin.flags.inThread")}{" "}
        <SafeLink to={routes.myNdla.arenaTopic(topic.id)}>{`"${topic.title}"`}</SafeLink>
      </Text>
      <FlaggedPostCard post={flaggedPost} topic={topic} />
      <Heading asChild consumeCss textStyle="title.small">
        <h2>{t("myNdla.arena.admin.flags.postFlags")}</h2>
      </Heading>
      <StyledList>
        {flaggedPost.flags?.map((flag) => {
          return <Flags key={flag.id} flag={flag} />;
        })}
      </StyledList>
    </MyNdlaPageWrapper>
  );
};

export default ArenaSingleFlagPage;
