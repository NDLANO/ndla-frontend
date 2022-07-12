/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { spacing } from '@ndla/core';

const StyledList = styled.ul`
  margin-left: ${spacing.nsmall};
`;

const TermsOfService = () => {
  return (
    <StyledList>
      <li>Du godtar at innholdet du lagrer kan endres når som helst</li>
      <li>Du godtar å ikke opprette mapper med støtende navn</li>
    </StyledList>
  );
};

export default TermsOfService;
