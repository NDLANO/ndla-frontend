/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { uuid } from '@ndla/util';
import {
  MediaList,
  MediaListItem,
  MediaListItemImage,
  MediaListItemBody,
  MediaListItemActions,
  MediaListItemMeta,
} from '@ndla/ui';
import { AudioDocument } from '@ndla/icons/common';
import {
  getGroupedContributorDescriptionList,
  metaTypes,
} from '@ndla/licenses';
import { useTranslation } from 'react-i18next';
import CopyTextButton from './CopyTextButton';
import AnchorButton from './AnchorButton';
import { GQLAudioLicense } from '../../graphqlTypes';
import { LocaleType } from '../../interfaces';
import { licenseCopyrightToCopyrightType } from './licenseHelpers';

interface AudioLicenseInfoProps {
  audio: GQLAudioLicense;
  locale: LocaleType;
}

const AudioLicenseInfo = ({ audio, locale }: AudioLicenseInfoProps) => {
  const { t } = useTranslation();
  const safeCopyright = licenseCopyrightToCopyrightType(audio.copyright);
  const items = getGroupedContributorDescriptionList(safeCopyright, locale);

  if (audio.title) {
    items.unshift({
      label: t('title'),
      description: audio.title,
      metaType: metaTypes.title,
    });
  }
  if (audio.copyright.origin) {
    items.push({
      label: t('source'),
      description: audio.copyright.origin,
      metaType: metaTypes.other,
    });
  }

  return (
    <MediaListItem>
      <MediaListItemImage>
        <AudioDocument className="c-medialist__icon" />
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
            {audio.copyright.license?.license !== 'COPYRIGHTED' && (
              <>
                {audio.copyText && (
                  <CopyTextButton
                    stringToCopy={audio.copyText}
                    copyTitle={t('license.copyTitle')}
                    hasCopiedTitle={t('license.hasCopiedTitle')}
                  />
                )}
                <AnchorButton href={audio.src} download appearance="outline">
                  {t('license.download')}
                </AnchorButton>
              </>
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
