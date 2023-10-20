/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { colors, spacing, breakpoints, mq, fonts, misc } from '@ndla/core';
import ArenaCard from '../ArenaCards/ArenaCard';

const StyledArenaHeader = styled.h1`
  ${fonts.sizes('38px', '48px')};
  font-weight: ${fonts.weight.bold};
  margin-bottom: ${spacing.small};
`;

const ArenaDescription = styled.div`
  width: 700px;
  ${fonts.sizes('18px', '29px')};
  font-weight: ${fonts.weight.normal};
`;

const ArenaTitle = styled.h2`
  ${fonts.sizes('22px', '33px')};
`;

const StyledCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: ${spacing.small} 0;
`;

const StyledBottomText = styled.div`
  ${fonts.sizes('16px', '26px')};
  font-weight: ${fonts.weight.normal};
  margin-top: ${spacing.small};
`;

const ArenaPage = () => {
  const { t } = useTranslation();
  return (
    <>
      <StyledArenaHeader>{t('arena.header')}</StyledArenaHeader>
      <ArenaDescription>{t('arena.description')}</ArenaDescription>
      <ArenaTitle>{t('arena.title')}</ArenaTitle>
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
      <StyledBottomText>
        Savner du en kategori? Du kan be om nye kategorier. Bruk “Spør NDLA”
        eller send en epost til moderator@ndla.no
      </StyledBottomText>
    </>
  );
};

export default ArenaPage;
