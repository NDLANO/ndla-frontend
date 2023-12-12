/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useTranslation } from 'react-i18next';
import CopyTextButton from './CopyTextButton';
import LicenseDescription from './LicenseDescription';

interface Props {
  oembed: string;
}
const OembedItem = ({ oembed }: Props) => {
  const { t } = useTranslation();
  return (
    <div>
      <LicenseDescription>
        {t('license.embedlink.description')}
      </LicenseDescription>
      <CopyTextButton
        copyTitle={t('license.embedlink.copyTitle')}
        hasCopiedTitle={t('license.embedlink.hasCopiedTitle')}
        stringToCopy={oembed}
      />
    </div>
  );
};

export default OembedItem;
