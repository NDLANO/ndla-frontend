import React from 'react';
import styled from '@emotion/styled';
import { FeideText, HumanMaleBoard } from '@ndla/icons/common';
import { ModalCloseButton } from '@ndla/modal';

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
    span {
      margin-left: 6.5px;
    }
  }
`;

interface Props {
  onClose: () => void;
}

const FeideLoginModal = ({ onClose }: Props) => {
  return (
    <StyledFeideModalBody>
      <div className="header">
        <h2>
          <FeideText />
        </h2>
        <ModalCloseButton title="Lukk" onClick={onClose} />
      </div>
      <div className="content">
        <p>
          Resources that require logging in with Feide, are tagged with the
          icon:
          <span>
            <HumanMaleBoard />
          </span>
        </p>
      </div>
    </StyledFeideModalBody>
  );
};

export default FeideLoginModal;
