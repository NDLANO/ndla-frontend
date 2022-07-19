/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';

const StyledList = styled.ul`
  margin-left: ${spacing.nsmall};
`;

const TermsOfService = () => {
  const { t } = useTranslation();
  return (
    <StyledList>
      <li>{t('myNdla.myPage.terms.term1')}</li>
      <li>{t('myNdla.myPage.terms.term2')}</li>
      <li>{t('myNdla.myPage.terms.term3')}</li>
    </StyledList>
  );
};

export default TermsOfService;
