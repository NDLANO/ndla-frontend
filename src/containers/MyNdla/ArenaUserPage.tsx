/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext } from 'react';
import { Heading } from '@ndla/typography';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { Navigate, useParams } from 'react-router-dom';
import { Spinner } from '@ndla/icons';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../components/AuthenticationContext';
import MyContactArea from './components/MyContactArea';
import MyNdlaPageWrapper from './components/MyNdlaPageWrapper';
import MyNdlaBreadcrumb from './components/MyNdlaBreadcrumb';
import { useArenaTopicsByUser, useArenaUser } from './arenaQueries';
import { GQLArenaTopicFragmentFragment } from '../../graphqlTypes';
import TopicCard from './Arena/components/TopicCard';

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
  const { user } = useContext(AuthContext);
  const { username } = useParams();
  const { arenaUser } = useArenaUser({
    variables: { username: username ?? '' },
    skip: !username,
  });
  const { arenaTopicsByUser, loading } = useArenaTopicsByUser({
    variables: { userSlug: arenaUser?.slug ?? '' },
    skip: !arenaUser?.slug,
  });

  if (loading) {
    return <Spinner />;
  }

  if (!user?.arenaEnabled && user?.arenaEnabled !== undefined) {
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
                    name: arenaUser?.displayName ?? '',
                    id: arenaUser?.id.toString() ?? '',
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
            personalData: user,
            arenaPage: true,
            arenaUserName: arenaUser?.displayName,
            arenaUserWorkplace: arenaUser?.location,
          }}
        />
      </MyContactAreaWrapper>
      <Heading element="h2" headingStyle="h2" margin="normal">
        {`${t('myNdla.arena.topicsBy')} ${arenaUser?.displayName}`}
      </Heading>
      <StyledUlWrapper>
        {arenaTopicsByUser?.map((topic: GQLArenaTopicFragmentFragment) => (
          <CardListItem key={`topicContainer-${topic.id}`}>
            <TopicCard
              key={`topic-${topic.id}`}
              id={topic.id.toString()}
              title={topic.title}
              timestamp={topic.timestamp}
              count={topic.postCount}
            />
          </CardListItem>
        ))}
      </StyledUlWrapper>
    </MyNdlaPageWrapper>
  );
};

export default ArenaUserPage;
