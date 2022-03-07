/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { InfoWidget, FrontpageInfo } from '@ndla/ui';
import { EmailOutline, Facebook, Twitter } from '@ndla/icons/common';
import { WithTranslation, withTranslation } from 'react-i18next';

const WelcomePageInfo = ({ t }: WithTranslation) => (
  <FrontpageInfo>
    <InfoWidget
      heading={t('newsLetter.heading')}
      description={t('newsLetter.description')}
      mainLink={{
        name: t('newsLetter.mainLinkName'),
        url: 'https://om.ndla.no/nyhetsbrev/',
      }}
      iconLinks={[
        {
          icon: <EmailOutline />,
          name: t('newsLetter.iconLinkName'),
          url: 'https://om.ndla.no/nyhetsbrev/',
        },
      ]}
    />
    <InfoWidget
      heading={t('welcomePage.socialMedia.heading')}
      description={t('welcomePage.socialMedia.description')}
      mainLink={{
        name: t('welcomePage.socialMedia.mainLink.name'),
        url: 'https://www.facebook.com/ndla.no/',
      }}
      iconLinks={[
        {
          name: 'Facebook',
          url: 'https://www.facebook.com/ndla.no/',
          icon: <Facebook />,
        },
        {
          name: 'Twitter',
          url: 'https://twitter.com/ndla_no',
          icon: <Twitter />,
        },
      ]}
    />
  </FrontpageInfo>
);

export default withTranslation()(WelcomePageInfo);
