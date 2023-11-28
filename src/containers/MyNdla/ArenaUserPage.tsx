/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext, useEffect } from 'react';
import { Breadcrumb } from '@ndla/ui';
import { Heading } from '@ndla/typography';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { Navigate, useParams } from 'react-router-dom';
import { Spinner } from '@ndla/icons';
import { AuthContext } from '../../components/AuthenticationContext';
import MyContactArea from './components/MyContactArea';
import MyNdlaPageWrapper from './components/MyNdlaPageWrapper';
import MyNdlaBreadcrumb from './components/MyNdlaBreadcrumb';
import { usePersonalData } from './userMutations';
import { useArenaTopicsByUser, useArenaUser } from './arenaQueries';
import { GQLArenaTopicFragmentFragment } from '../../graphqlTypes';
import TopicCard from './Arena/components/TopicCard';

const BreadcrumbWrapper = styled.div`
  margin-top: ${spacing.normal};
`;

const StyledUlWrapper = styled.ul`
  margin: 0px;
  padding: 0px;
`;

const StyledCardContainer = styled.li`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xsmall};
  margin: ${spacing.small} 0;
`;

const ArenaUserPage = () => {
  const { user } = useContext(AuthContext);
  const { username } = useParams();
  const { authenticated } = useContext(AuthContext);
  const { personalData, fetch: fetchPersonalData } = usePersonalData();
  const { arenaUser } = useArenaUser(username ?? '');
  const { arenaTopicsByUser, loading } = useArenaTopicsByUser(
    arenaUser?.slug ?? '',
  );

  useEffect(() => {
    if (authenticated) {
      fetchPersonalData();
    }
  }, [authenticated, fetchPersonalData]);

  if (loading) {
    return <Spinner />;
  }

  if (!personalData?.arenaEnabled && personalData?.arenaEnabled !== undefined) {
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
          page={'arena'}
        />
      </BreadcrumbWrapper>
      <Breadcrumb items={[]} />
      <MyContactArea
        user={user}
        arenaPage
        arenaUserName={arenaUser?.displayName}
        arenaUserWorkplace={arenaUser?.location}
      />
      <Heading element="h2" headingStyle="h2">
        {`Hardcoded Innlegg av ${arenaUser?.displayName}`}
      </Heading>
      <StyledUlWrapper>
        {arenaTopicsByUser?.map((topic: GQLArenaTopicFragmentFragment) => (
          <StyledCardContainer key={`topicContainer-${topic.id}`}>
            <TopicCard
              key={`topic-${topic.id}`}
              id={topic.id.toString()}
              title={topic.title}
              timestamp={topic.timestamp}
              count={topic.postCount}
            />
          </StyledCardContainer>
        ))}
      </StyledUlWrapper>
    </MyNdlaPageWrapper>
  );
};

export default ArenaUserPage;
