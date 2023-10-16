/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { colors, spacing, breakpoints, mq, fonts, misc } from '@ndla/core';
import ArenaCard from '../ArenaCards/ArenaCard';

const StyledCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ArenaDescription = styled.div`
  width: 700px;
  margin-bottom: 48px;
  ${fonts.sizes('18px', '29px')};
  font-weight: ${fonts.weight.normal};
`;

const ArenaTitle = styled.div`
  ${fonts.sizes('22px', '33px')};
  font-weight: ${fonts.weight.bold};
  margin-bottom: 24px;
`;

const ArenaPage = () => {
  return (
    <>
      <h1>Arena</h1>
      <ArenaDescription>
        Velkommen til NDLAs Arena. Her kan du diskutere, dele og samarbeide med
        andre lærere fra hele Norge.
      </ArenaDescription>
      <ArenaTitle>Kategorier</ArenaTitle>
      <StyledCardContainer>
        <ArenaCard
          id="123"
          cardType="ArenaCategory"
          title={'Bygg- og anleggsteknikk'}
          subText={'Beskrivelse'}
          count={20}
        />
        <ArenaCard
          id="123"
          cardType="ArenaCategory"
          title={'Bygg- og anleggsteknikk'}
          subText={'Beskrivelse'}
          count={20}
        />
        <ArenaCard
          id="123"
          cardType="ArenaCategory"
          title={'Bygg- og anleggsteknikk'}
          subText={'Beskrivelse'}
          count={20}
        />
      </StyledCardContainer>
      <div>
        Savner du en kategori? Du kan be om nye kategorier. Bruk “Spør NDLA”
        eller send en epost til moderator@ndla.no
      </div>
    </>
  );
};

export default ArenaPage;
