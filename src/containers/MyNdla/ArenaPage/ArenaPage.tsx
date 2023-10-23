/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo, useState, useEffect } from 'react';
import { Reference, useApolloClient, gql } from '@apollo/client';
import { Spinner } from '@ndla/icons';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { colors, spacing, breakpoints, mq, fonts, misc } from '@ndla/core';
import {
  GQLArenaBreadcrumb,
  GQLArenaCategory,
  GQLArenaPost,
  GQLArenaTopic,
} from '../../../graphqlTypes';
import { Heading } from '@ndla/typography';
import ArenaCard from '../ArenaCards/ArenaCard';

interface Props {
  categories: GQLArenaCategory[];
}

const StyledArenaHeader = styled(Heading)`
  ${fonts.sizes('38px', '48px')};
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
      <StyledArenaHeader element="h1" headingStyle="default">
        {t('arena.header')}
      </StyledArenaHeader>
      <ArenaDescription>{t('arena.description')}</ArenaDescription>
      <ArenaTitle>{t('arena.title')}</ArenaTitle>
      <StyledCardContainer>
        <ArenaCard
          id="123"
          cardType="ArenaCategory"
          title="Bygg- og anleggsteknikk"
          subText="Beskrivelse"
          count={20}
        />
        <ArenaCard
          id="123"
          cardType="ArenaCategory"
          title="Bygg- og anleggsteknikk"
          subText="Beskrivelse"
          count={20}
        />
        <ArenaCard
          id="123"
          cardType="ArenaCategory"
          title="Bygg- og anleggsteknikk"
          subText="Beskrivelse"
          count={20}
        />
      </StyledCardContainer>
      <StyledBottomText>{t('arena.bottomText')}</StyledBottomText>
    </>
  );
};

export default ArenaPage;
