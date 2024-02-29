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
import styled from "@emotion/styled";
import { spacing } from "@ndla/core";
import { Spinner } from "@ndla/icons";
import { Heading } from "@ndla/typography";
import { useArenaTopicsByUser, useArenaUser } from "./Arena/components/temporaryNodebbHooks";
import TopicCard from "./Arena/components/TopicCard";
import UserProfileAdministration from "./Arena/components/UserProfileAdministration";
import MyContactArea from "./components/MyContactArea";
import MyNdlaBreadcrumb from "./components/MyNdlaBreadcrumb";
import MyNdlaPageWrapper from "./components/MyNdlaPageWrapper";
import { AuthContext } from "../../components/AuthenticationContext";

const BreadcrumbWrapper = styled.div`
  padding-top: ${spacing.normal};
`;

const MyContactAreaWrapper = styled.div`
  margin: ${spacing.large} 0 ${spacing.normal};
`;

const StyledUlWrapper = styled.ul`
  padding: 0px;
`;

const CardListItem = styled.li`
  list-style: none;
`;

const ArenaUserPage = () => {
  const { t } = useTranslation();
  const { user, authContextLoaded } = useContext(AuthContext);
  const { username } = useParams();
  const { arenaUser, loading: userLoading } = useArenaUser(username);
  const { arenaTopicsByUser, loading } = useArenaTopicsByUser(arenaUser?.id, arenaUser?.slug);

  if (loading || userLoading || !authContextLoaded) {
    return <Spinner />;
  }

  if (!user?.arenaEnabled) {
    return <Navigate to="/minndla" />;
  }

  return (
    <MyNdlaPageWrapper>
      <BreadcrumbWrapper>
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
      </BreadcrumbWrapper>
      <MyContactAreaWrapper>
        <MyContactArea
          user={{
            username: arenaUser?.displayName,
            displayName: arenaUser?.displayName,
            primaryOrg: arenaUser?.location,
          }}
        />
      </MyContactAreaWrapper>
      <Heading element="h2" headingStyle="h2" margin="normal">
        {`${t("myNdla.arena.topicsBy")} ${arenaUser?.displayName}`}
      </Heading>
      <StyledUlWrapper>
        {arenaTopicsByUser?.items?.map((topic) => (
          <CardListItem key={`topicContainer-${topic.id}`}>
            <TopicCard
              key={`topic-${topic.id}`}
              id={topic.id}
              title={topic.title}
              timestamp={topic.created}
              count={topic.postCount}
            />
          </CardListItem>
        ))}
      </StyledUlWrapper>
      <UserProfileAdministration userToAdmin={arenaUser} />
    </MyNdlaPageWrapper>
  );
};

export default ArenaUserPage;
