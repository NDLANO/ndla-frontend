/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { useContext } from 'react';
import { AuthContext } from '../../components/AuthenticationContext';
import { UserInfo } from '../../components/UserInfo';

const Wrapper = styled.div`
  padding: 4rem 2rem;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 20;
`;

const MyNdlaPage = () => {
  const { user } = useContext(AuthContext);
  if (!user) return <div>No user...</div>;
  return (
    <Wrapper>
      <UserInfo user={user} />
    </Wrapper>
  );
};

export default MyNdlaPage;
