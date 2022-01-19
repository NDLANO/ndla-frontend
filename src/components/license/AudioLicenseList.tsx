/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { uuid } from '@ndla/util';
import {
  //@ts-ignore
  MediaList,
  //@ts-ignore
  MediaListItem,
  //@ts-ignore
  MediaListItemImage,
  //@ts-ignore
  MediaListItemBody,
  //@ts-ignore
  MediaListItemActions,
  //@ts-ignore
  MediaListItemMeta,
} from '@ndla/ui';
import { AudioDocument } from '@ndla/icons/common';
import { getGroupedContributorDescriptionList } from '@ndla/licenses';
import { useTranslation } from 'react-i18next';
import CopyTextButton from './CopyTextButton';
import AnchorButton from './AnchorButton';
import { GQLAudioLicense } from '../../graphqlTypes';
import { LocaleType } from '../../interfaces';
import { licenseCopyrightToCopyrightType } from './licenseHelpers';

interface MetaImage {
  alt: string;
  url: string;
}

interface AudioLicenseInfoProps {
  audio: GQLAudioLicense;
  locale: LocaleType;
  image?: MetaImage;
}

export const AudioLicenseInfo = ({
  audio,
  locale,
  image,
}: AudioLicenseInfoProps) => {
  const { t } = useTranslation();
  const safeCopyright = licenseCopyrightToCopyrightType(audio.copyright);
  const items = getGroupedContributorDescriptionList(safeCopyright, locale);
  return (
    <MediaListItem>
      <MediaListItemImage>
        {image ? (
          <img alt={image.alt} src={image.url} />
        ) : (
          <AudioDocument className="c-medialist__icon" />
        )}{' '}
      </MediaListItemImage>
      <MediaListItemBody
        title={t('license.audio.rules')}
        license={audio.copyright.license?.license}
        resourceType="audio"
        resourceUrl={audio.src}
        locale={locale}>
        <MediaListItemActions>
          <div className="c-medialist__ref">
            <MediaListItemMeta items={items} />
            <CopyTextButton
              stringToCopy={audio.copyText}
              copyTitle={t('license.copyTitle')}
              hasCopiedTitle={t('license.hasCopiedTitle')}
            />
            {audio.copyright.license?.license !== 'COPYRIGHTED' && (
              <AnchorButton href={audio.src} download appearance="outline">
                {t('license.download')}
              </AnchorButton>
            )}
          </div>
        </MediaListItemActions>
      </MediaListItemBody>
    </MediaListItem>
  );
};

interface Props {
  audios: GQLAudioLicense[];
  locale: LocaleType;
}

const AudioLicenseList = ({ audios, locale }: Props) => {
  const { t } = useTranslation();
  return (
    <div>
      <h2>{t('license.audio.heading')}</h2>
      <p>{t('license.audio.description')}</p>
      <MediaList>
        {audios.map(audio => (
          <AudioLicenseInfo audio={audio} key={uuid()} locale={locale} />
        ))}
      </MediaList>
    </div>
  );
};

export default AudioLicenseList;
