/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DrawerMenuItem from './DrawerMenuItem';
import DrawerPortion from './DrawerPortion';
import DrawerRowHeader from './DrawerRowHeader';
import { useMenuContext } from './MenuContext';

const aboutUrl = 'http://om.ndla.no/';
const whatIsUrl = 'https://om.ndla.no/hva-er-ndla/';
const numbersUrl = 'https://om.ndla.no/tall-og-rapporter/';
const organizationUrl = 'https://om.ndla.no/organisasjon/';
const keyPersonnelUrl = 'https://om.ndla.no/organisasjon/nokkelpersoner-ndla/';
const vacanciesUrl = 'https://om.ndla.no/utlysninger/';
const newsletterUrl = 'https://om.ndla.no/nyhetsbrev/';
const contactUrl = 'https://om.ndla.no/kontakt-oss/';

interface Props {
  onClose: () => void;
  closeSubMenu: () => void;
}

const AboutMenu = ({ onClose, closeSubMenu }: Props) => {
  const { t } = useTranslation();
  const { registerClose } = useMenuContext();

  useEffect(() => {
    registerClose(closeSubMenu);
  }, []);
  return (
    <DrawerPortion>
      <DrawerRowHeader
        title="Om NDLA"
        type="link"
        to={aboutUrl}
        onClose={onClose}
      />
      <DrawerMenuItem type="link" to={whatIsUrl} external>
        {t('masthead.menuOptions.about.whatIs')}
      </DrawerMenuItem>
      <DrawerMenuItem type="link" to={organizationUrl} external>
        {t('masthead.menuOptions.about.organization')}
      </DrawerMenuItem>
      <DrawerMenuItem type="link" to={numbersUrl} external>
        {t('masthead.menuOptions.about.numbers')}
      </DrawerMenuItem>
      <DrawerMenuItem type="link" to={keyPersonnelUrl} external>
        {t('masthead.menuOptions.about.keyPersonnel')}
      </DrawerMenuItem>
      <DrawerMenuItem type="link" to={vacanciesUrl} external>
        {t('masthead.menuOptions.about.vacancies')}
      </DrawerMenuItem>
      <DrawerMenuItem type="link" to={newsletterUrl} external>
        {t('masthead.menuOptions.about.newsletter')}
      </DrawerMenuItem>
      <DrawerMenuItem type="link" to={contactUrl} external>
        {t('masthead.menuOptions.about.contact')}
      </DrawerMenuItem>
    </DrawerPortion>
  );
};

export default AboutMenu;
