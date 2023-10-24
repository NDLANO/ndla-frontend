/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { fonts, colors } from '@ndla/core';

const ModeratorTagContainer = styled.div`
  border-radius: 4px;
  padding: 2px 12px;
  background-color: ${colors.brand.primary};
  width: fit-content;
  height: fit-content;
  ${fonts.sizes('12px', '20px')}
  color: ${colors.white};
  font-weight: ${fonts.weight.semibold};
`;

function ModeratorTag() {
  const { t } = useTranslation();
  return <ModeratorTagContainer>{t('user.moderator')}</ModeratorTagContainer>;
}

export default ModeratorTag;
