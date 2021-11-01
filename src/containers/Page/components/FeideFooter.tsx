import React, { useContext } from 'react';
import { RouteProps } from 'react-router';

import styled from '@emotion/styled';
import { FeideText, LogIn } from '@ndla/icons/common';

import FeideLoginButton from '../../../components/FeideLoginButton';
import { AuthContext } from '../../../components/AuthenticationContext';

const StyledFeideFooter = styled.div`
  display: flex;
  flex-direction: column;
  -webkit-box-align: center;
  align-items: center;
  background: rgb(34, 34, 34);
  color: rgb(255, 255, 255);
  padding: 32.5px 26px 52px;
  h2 {
    margin: 0;
    svg {
      width: 82px;
      height: 28px;
    }
  }
  div {
    display: flex;
    flex-direction: column;
    margin-top: 26px;
    -webkit-box-align: center;
    align-items: center;

    p {
      margin: 0px 0px 32.5px;
      font-weight: 300;
      line-height: 32px;

      span {
        margin-left: 6.5px;
      }
    }
  }
`;

interface Props {
  location: RouteProps['location'];
}

const FeideFooter = ({ location }: Props) => {
  const { authenticated } = useContext(AuthContext);

  return (
    <StyledFeideFooter>
      <h2>
        <FeideText />
      </h2>

      <div>
        <p>
          Some resources may only be accessed by teachers who are logged in.
        </p>
        <FeideLoginButton footer location={location}>
          {authenticated ? (
            <span>du er logget inn</span>
          ) : (
            <span>
              Log in with Feide <LogIn className="c-icon--medium" />
            </span>
          )}
        </FeideLoginButton>
      </div>
    </StyledFeideFooter>
  );
};

export default FeideFooter;
