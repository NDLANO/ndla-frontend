/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useParams } from "react-router-dom";
import { Heading } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { TopicListItem } from "./Arena/components/ArenaListItem";
import { useArenaTopicsByUser, useArenaUser } from "./Arena/components/temporaryNodebbHooks";
import UserProfileAdministration from "./Arena/components/UserProfileAdministration";
import MyContactArea from "./components/MyContactArea";
import MyNdlaBreadcrumb from "./components/MyNdlaBreadcrumb";
import MyNdlaPageWrapper from "./components/MyNdlaPageWrapper";
import TitleWrapper from "./components/TitleWrapper";
import { AuthContext } from "../../components/AuthenticationContext";
import { PageSpinner } from "../../components/PageSpinner";
import { routes } from "../../routeHelpers";

const StyledUlWrapper = styled("ul", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
  },
});

const CardListItem = styled("li", {
  base: {
    listStyle: "none",
  },
});

const ArenaUserPage = () => {
  const { t } = useTranslation();
  const { user, authContextLoaded } = useContext(AuthContext);
  const { username } = useParams();
  const idFromParam = username && parseInt(username);
  const userParam = idFromParam ? idFromParam : username;
  const { arenaUser, loading: userLoading } = useArenaUser(userParam);
  const { arenaTopicsByUser, loading } = useArenaTopicsByUser(arenaUser?.id, arenaUser?.slug);

  if (loading || userLoading || !authContextLoaded) {
    return <PageSpinner />;
  }

  if (!user?.arenaEnabled) {
    return <Navigate to={routes.myNdla.root} />;
  }

  return (
    <MyNdlaPageWrapper>
      <TitleWrapper>
        <MyNdlaBreadcrumb
          breadcrumbs={
            username
              ? [
                  {
                    name: arenaUser?.displayName ?? "",
                    id: arenaUser?.id?.toString() ?? "",
                  },
                ]
              : []
          }
          page="arena"
        />
      </TitleWrapper>
      <MyContactArea
        user={{
          username: arenaUser?.displayName,
          displayName: arenaUser?.displayName,
          primaryOrg: arenaUser?.location,
        }}
      />
      <Heading textStyle="heading.small" asChild consumeCss>
        <h2>{`${t("myNdla.arena.topicsBy")} ${arenaUser?.displayName}`}</h2>
      </Heading>
      <StyledUlWrapper>
        {arenaTopicsByUser?.items?.map((topic) => (
          <CardListItem key={`topicContainer-${topic.id}`}>
            <TopicListItem
              key={`topic-${topic.id}`}
              context="list"
              id={topic.id}
              title={topic.title}
              timestamp={topic.created}
              postCount={topic.postCount}
              voteCount={topic.voteCount}
            />
          </CardListItem>
        ))}
      </StyledUlWrapper>
      <UserProfileAdministration userToAdmin={arenaUser} />
    </MyNdlaPageWrapper>
  );
};

export default ArenaUserPage;
