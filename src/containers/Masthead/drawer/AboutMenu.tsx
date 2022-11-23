/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import BackButton from './BackButton';
import DrawerMenuItem from './DrawerMenuItem';
import DrawerPortion, { DrawerList } from './DrawerPortion';
import DrawerRowHeader from './DrawerRowHeader';
import useArrowNavigation from './useArrowNavigation';

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
  onCloseMenuPortion: () => void;
}

const AboutMenu = ({ onClose, onCloseMenuPortion }: Props) => {
  const { t } = useTranslation();
  useArrowNavigation(true, 'header-about-ndla', undefined, onCloseMenuPortion);

  return (
    <DrawerPortion>
      <BackButton title="Go home" homeButton onGoBack={onCloseMenuPortion} />
      <DrawerList>
        <DrawerRowHeader
          id={'about-ndla'}
          title="Om NDLA"
          type="link"
          to={aboutUrl}
          onClose={onClose}
        />
        <DrawerMenuItem id="whatIs" type="link" to={whatIsUrl} external>
          {t('masthead.menuOptions.about.whatIs')}
        </DrawerMenuItem>
        <DrawerMenuItem
          id="organization"
          type="link"
          to={organizationUrl}
          external>
          {t('masthead.menuOptions.about.organization')}
        </DrawerMenuItem>
        <DrawerMenuItem id="numbers" type="link" to={numbersUrl} external>
          {t('masthead.menuOptions.about.numbers')}
        </DrawerMenuItem>
        <DrawerMenuItem
          id="keyPersonnel"
          type="link"
          to={keyPersonnelUrl}
          external>
          {t('masthead.menuOptions.about.keyPersonnel')}
        </DrawerMenuItem>
        <DrawerMenuItem id="vacancies" type="link" to={vacanciesUrl} external>
          {t('masthead.menuOptions.about.vacancies')}
        </DrawerMenuItem>
        <DrawerMenuItem id="link" type="link" to={newsletterUrl} external>
          {t('masthead.menuOptions.about.newsletter')}
        </DrawerMenuItem>
        <DrawerMenuItem id="contact" type="link" to={contactUrl} external>
          {t('masthead.menuOptions.about.contact')}
        </DrawerMenuItem>
      </DrawerList>
    </DrawerPortion>
  );
};

export default AboutMenu;
