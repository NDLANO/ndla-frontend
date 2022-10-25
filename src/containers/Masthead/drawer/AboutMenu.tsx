/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import DrawerMenuItem from './DrawerMenuItem';
import DrawerPortion from './DrawerPortion';

const MenuWrapper = styled(DrawerPortion)`
  display: flex;
  flex-direction: column;
`;

const whatIsUrl = 'https://om.ndla.no/hva-er-ndla/';
const numbersUrl = 'https://om.ndla.no/tall-og-rapporter/';
const organizationUrl = 'https://om.ndla.no/organisasjon/';
const keyPersonnelUrl = 'https://om.ndla.no/organisasjon/nokkelpersoner-ndla/';
const vacanciesUrl = 'https://om.ndla.no/utlysninger/';
const newsletterUrl = 'https://om.ndla.no/nyhetsbrev/';
const contactUrl = 'https://om.ndla.no/kontakt-oss/';

const AboutMenu = () => {
  const { t } = useTranslation();
  return (
    <MenuWrapper>
      <DrawerMenuItem type="link" to={whatIsUrl}>
        {t('masthead.menuOptions.about.whatIs')}
      </DrawerMenuItem>
      <DrawerMenuItem type="link" to={organizationUrl}>
        {t('masthead.menuOptions.about.organization')}
      </DrawerMenuItem>
      <DrawerMenuItem type="link" to={numbersUrl}>
        {t('masthead.menuOptions.about.numbers')}
      </DrawerMenuItem>
      <DrawerMenuItem type="link" to={keyPersonnelUrl}>
        {t('masthead.menuOptions.about.keyPersonnel')}
      </DrawerMenuItem>
      <DrawerMenuItem type="link" to={vacanciesUrl}>
        {t('masthead.menuOptions.about.vacancies')}
      </DrawerMenuItem>
      <DrawerMenuItem type="link" to={newsletterUrl}>
        {t('masthead.menuOptions.about.newsletter')}
      </DrawerMenuItem>
      <DrawerMenuItem type="link" to={contactUrl}>
        {t('masthead.menuOptions.about.contact')}
      </DrawerMenuItem>
    </MenuWrapper>
  );
};

export default AboutMenu;
