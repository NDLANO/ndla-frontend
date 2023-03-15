/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { ButtonV2 } from '@ndla/button';
import { SafeLinkButton } from '@ndla/safelink';
import { useTranslation } from 'react-i18next';
import { downloadUrl } from '../../../components/license/ImageLicenseList';

interface ImageActionButtonProps {
  copyString: string;
  license: string;
  src: string;
}

const ImageActionButtons = ({
  copyString,
  license,
  src,
}: ImageActionButtonProps) => {
  const { t } = useTranslation();

  if (license === 'COPYRIGHTED') {
    return null;
  }
  return (
    <>
      <ButtonV2
        key="copy"
        variant="outline"
        data-copied-title={t('license.hasCopiedTitle')}
        data-copy-string={copyString}
      >
        {t('license.copyTitle')}
      </ButtonV2>
      <SafeLinkButton
        key="download"
        to={downloadUrl(src)}
        variant="outline"
        download
      >
        {t('license.download')}
      </SafeLinkButton>
    </>
  );
};

export default ImageActionButtons;
