/*
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useContext, useEffect, useState } from 'react';
import { RouteProps } from 'react-router';
import styled from '@emotion/styled';
import { StyledButton } from '@ndla/button';
import { FeideText, HumanMaleBoard, LogOut } from '@ndla/icons/common';
import { ModalCloseButton } from '@ndla/modal';

import { AuthContext } from '../../components/AuthenticationContext';
import { fetchFeideGroups, FeideGroupType } from './feideApi';

const Button = StyledButton.withComponent('a');

const StyledFeideModalBody = styled('div')`
  padding: 26px 32.5px 32.5px;

  div.header {
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
    -webkit-box-align: start;
    align-items: start;
    h2 {
      margin: 13px 0px 0px;
      svg {
        width: 82px;
        height: 28px;
        color: rgb(0, 0, 0);
      }
      button {
        display: inline-block;
        outline-width: 0px;
        cursor: pointer;
        text-decoration: none;
        font-family: 'Source Sans Pro', Helvetica, Arial, STKaiti, 华文楷体,
          KaiTi, SimKai, 楷体, KaiU, DFKai-SB, 標楷體, SongTi, 宋体, sans-serif;
        transition: all 0.2s cubic-bezier(0.17, 0.04, 0.03, 0.94) 0s;
        text-align: center;
        padding: 0px;
      }
    }
  }
  div.content {
    ul {
      padding-left: 2em;
    }
    span {
      margin-left: 6.5px;
    }
  }
`;

interface Props {
  onClose: () => void;
  location: RouteProps['location'];
}

const FeideLoginModal = ({ onClose, location }: Props) => {
  const { authenticated } = useContext(AuthContext);
  const [feideGroups, setFeideGroups] = useState<FeideGroupType[]>();

  useEffect(() => {
    if (authenticated) {
      fetchFeideGroups().then((a: FeideGroupType[] | undefined) => {
        setFeideGroups(a);
      });
    }
  }, [authenticated]);
  const primarySchool = feideGroups?.find(g => g.membership.primarySchool);
  const parentOrg = feideGroups?.find(g => g.id === primarySchool?.parent);
  const affiliationRole = parentOrg?.membership.primaryAffiliation;

  return (
    <StyledFeideModalBody>
      <div className="header">
        <h2>
          <FeideText />
        </h2>
        <ModalCloseButton title="Lukk" onClick={onClose} />
      </div>
      <div className="content">
        <p>Du er logget inn som {affiliationRole}</p>
        <p>
          We have collected the following information about you:
          <ul>
            <li>{affiliationRole}</li>
            <li>{primarySchool?.displayName}</li>
          </ul>
          Resources that require logging in with Feide, are tagged with the icon
          <span>
            <HumanMaleBoard />
          </span>
        </p>
        <Button
          href="/logout"
          onClick={() =>
            location && localStorage.setItem('lastPath', location.pathname)
          }>
          <span>
            Log out <LogOut className="c-icon--medium" />
          </span>
        </Button>
      </div>
    </StyledFeideModalBody>
  );
};

export default FeideLoginModal;
