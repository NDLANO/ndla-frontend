/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext } from 'react';
import { Breadcrumb } from '@ndla/ui';
import { Heading } from '@ndla/typography';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../components/AuthenticationContext';
import MyContactArea from './components/MyContactArea';
import MyNdlaPageWrapper from './components/MyNdlaPageWrapper';
import MyNdlaBreadcrumb from './components/MyNdlaBreadcrumb';

const TopicWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
`;

const BreadcrumbWrapper = styled.div`
  margin-top: ${spacing.normal};
`;

const ArenaUserPage = () => {
  const { user } = useContext(AuthContext);
  const { username } = useParams();

  return (
    <MyNdlaPageWrapper>
      <BreadcrumbWrapper>
        <MyNdlaBreadcrumb
          breadcrumbs={username ? [{ name: username ?? '', id: username }] : []}
          page={'folders'} //temporary
        />
      </BreadcrumbWrapper>
      <Breadcrumb items={[]} />
      <MyContactArea user={user} />
      <Heading element="h2" headingStyle="h2">
        {`Hardcoded Innlegg av ${user?.displayName}`}
      </Heading>
      <TopicWrapper>{'Topics'}</TopicWrapper>
    </MyNdlaPageWrapper>
  );
};

export default ArenaUserPage;
