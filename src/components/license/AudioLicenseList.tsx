/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from '@apollo/client';
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
import { SafeLinkButton } from '@ndla/safelink';
import { GQLAudioLicenseList_AudioLicenseFragment } from '../../graphqlTypes';
import { licenseCopyrightToCopyrightType } from './licenseHelpers';
import { licenseListCopyrightFragment } from './licenseFragments';

interface AudioLicenseInfoProps {
  audio: GQLAudioLicenseList_AudioLicenseFragment;
}

const AudioLicenseInfo = ({ audio }: AudioLicenseInfoProps) => {
  const { t, i18n } = useTranslation();
  const safeCopyright = licenseCopyrightToCopyrightType(audio.copyright);
  const items = getGroupedContributorDescriptionList(
    safeCopyright,
    i18n.language,
  );

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
        locale={i18n.language}
      >
        <MediaListItemActions>
          <div className="c-medialist__ref">
            <MediaListItemMeta items={items} />
            {audio.copyright.license?.license !== 'COPYRIGHTED' && (
              <>
                <SafeLinkButton to={audio.src} download variant="outline">
                  {t('license.download')}
                </SafeLinkButton>
              </>
            )}
          </div>
        </MediaListItemActions>
      </MediaListItemBody>
    </MediaListItem>
  );
};

interface Props {
  audios: GQLAudioLicenseList_AudioLicenseFragment[];
}

const AudioLicenseList = ({ audios }: Props) => {
  const { t } = useTranslation();
  return (
    <div>
      <h2>{t('license.audio.heading')}</h2>
      <p>{t('license.audio.description')}</p>
      <MediaList>
        {audios.map((audio) => (
          <AudioLicenseInfo audio={audio} key={uuid()} />
        ))}
      </MediaList>
    </div>
  );
};

AudioLicenseList.fragments = {
  audio: gql`
    fragment AudioLicenseList_AudioLicense on AudioLicense {
      id
      src
      title
      copyright {
        origin
        ...LicenseListCopyright
      }
    }
    ${licenseListCopyrightFragment}
  `,
};

export default AudioLicenseList;
