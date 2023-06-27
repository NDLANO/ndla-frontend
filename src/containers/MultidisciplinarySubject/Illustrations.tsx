/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { breakpoints, mq } from '@ndla/core';

export const ClimateIllustration = styled.div`
  background-image: url('/static/illustrations/climate.svg');
  background-repeat: no-repeat;
  background-size: auto 100%;
  background-position: 75% 100%;
  height: 100px;
  flex: 1;
  ${mq.range({ from: breakpoints.tabletWide })} {
    height: 178px;
    background-position: 70% 100%;
    margin-top: -56px;
  }
  ${mq.range({ from: breakpoints.desktop })} {
    background-position: 65% 100%;
  }
`;

export const PublicHealthIllustration = styled.div`
  background-image: url('/static/illustrations/public_health.svg');
  background-repeat: no-repeat;
  background-size: auto 100%;
  background-position: 75% 100%;
  height: 100px;
  flex: 1;
  ${mq.range({ from: breakpoints.tabletWide })} {
    height: 178px;
    background-position: 70% 100%;
    margin-top: -36px;
  }
  ${mq.range({ from: breakpoints.desktop })} {
    background-position: 65% 100%;
    margin-top: -56px;
  }
`;
export const DemocracyIllustration = styled.div`
  background-image: url('/static/illustrations/democracy.svg');
  background-repeat: no-repeat;
  background-size: auto 100%;
  background-position: 75% 100%;
  height: 100px;
  flex: 1;
  ${mq.range({ from: breakpoints.mobileWide })} {
    height: 117px;
  }
  ${mq.range({ from: breakpoints.tabletWide })} {
    height: 178px;
    background-position: 70% 100%;
    margin-top: -56px;
  }
  ${mq.range({ from: breakpoints.desktop })} {
    background-position: 65% 100%;
  }
`;

export const PublicHealthDemocracyIllustration = styled.div`
  background-image: url('/static/illustrations/public_health_democracy.svg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 100% 100%;
  height: 100px;
  flex: 1;
  margin-top: 16px;
  ${mq.range({ from: breakpoints.mobileWide })} {
    height: 117px;
  }
  ${mq.range({ from: breakpoints.tabletWide })} {
    height: 128px;
  }
  ${mq.range({ from: breakpoints.desktop })} {
    background-size: auto 100%;
    height: 178px;
    margin-top: -56px;
  }
`;

export const DemocracyClimateIllustration = styled.div`
  background-image: url('/static/illustrations/democracy_climate.svg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 100% 100%;
  height: 90px;
  flex: 1;
  ${mq.range({ from: breakpoints.mobileWide })} {
    height: 117px;
  }
  ${mq.range({ from: breakpoints.tabletWide })} {
    height: 128px;
  }
  ${mq.range({ from: breakpoints.desktop })} {
    background-size: auto 100%;
    height: 178px;
  }
  ${mq.range({ from: '1120px' })} {
    margin-top: -56px;
  }
`;

export const PublicHealthClimateIllustration = styled.div`
  background-image: url('/static/illustrations/public_health_climate.svg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 100% 100%;
  height: 85px;
  flex: 1;
  margin-top: 16px;
  ${mq.range({ from: breakpoints.mobileWide })} {
    height: 117px;
  }
  ${mq.range({ from: breakpoints.tabletWide })} {
    height: 128px;
  }
  ${mq.range({ from: '1050px' })} {
    background-size: auto 100%;
    height: 178px;
    margin-top: -56px;
  }
`;

export const PublicHealthDemocracyClimateIllustration = styled.div`
  background-image: url('/static/illustrations/public_health_democracy_climate.svg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 100% 100%;
  height: 58px;
  flex: 1;
  margin-top: 16px;
  ${mq.range({ from: breakpoints.mobileWide })} {
    height: 76px;
  }
  ${mq.range({ from: breakpoints.tablet })} {
    height: 96px;
  }
  ${mq.range({ from: breakpoints.tabletWide })} {
    height: 118px;
  }
  ${mq.range({ from: '900px' })} {
    height: 138px;
  }
  ${mq.range({ from: breakpoints.desktop })} {
    height: 158px;
  }
  ${mq.range({ from: breakpoints.wide })} {
    background-size: auto 100%;
    height: 178px;
  }
`;

export const AllSubjectsPersonIllustration = styled.div`
  background-image: url('/static/illustrations/all_subjects_person.svg');
  background-repeat: no-repeat;
  background-size: auto 100%;
  background-position: 100% 100%;
  height: 175px;
  width: 208px;
`;
