/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import uniqBy from 'lodash/uniqBy';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { gql } from '@apollo/client';
import { AudioDocument } from '@ndla/icons/common';
import {
  getGroupedContributorDescriptionList,
  metaTypes,
} from '@ndla/licenses';
import { SafeLinkButton } from '@ndla/safelink';
import {
  MediaList,
  MediaListItem,
  MediaListItemImage,
  MediaListItemBody,
  MediaListItemActions,
  MediaListItemMeta,
  ItemType,
} from '@ndla/ui';
import { uuid } from '@ndla/util';
import LicenseDescription from './LicenseDescription';
import { licenseListCopyrightFragment } from './licenseFragments';
import {
  isCopyrighted,
  licenseCopyrightToCopyrightType,
} from './licenseHelpers';
import { GQLAudioLicenseList_AudioLicenseFragment } from '../../graphqlTypes';

interface AudioLicenseInfoProps {
  audio: GQLAudioLicenseList_AudioLicenseFragment;
}

const AudioLicenseInfo = ({ audio }: AudioLicenseInfoProps) => {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();

  const pageUrl = useMemo(() => `/audio/${audio.id}`, [audio.id]);

  const shouldShowLink = useMemo(
    () =>
      pathname !== pageUrl && !isCopyrighted(audio.copyright.license.license),
    [pathname, pageUrl, audio.copyright.license.license],
  );

  const safeCopyright = licenseCopyrightToCopyrightType(audio.copyright);
  const items: ItemType[] = getGroupedContributorDescriptionList(
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
  if (audio.copyright.processed === true) {
    items.push({
      label: t('license.processed'),
      metaType: metaTypes.otherWithoutDescription,
    });
  }

  return (
    <MediaListItem>
      <MediaListItemImage canOpen={shouldShowLink}>
        {!shouldShowLink ? (
          <AudioDocument className="c-medialist__icon" />
        ) : (
          <Link
            to={pageUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('embed.goTo', { type: t('embed.type.audio') })}
          >
            <AudioDocument className="c-medialist__icon" />
          </Link>
        )}
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
  const unique = useMemo(() => uniqBy(audios, (audio) => audio.id), [audios]);
  return (
    <div>
      <LicenseDescription>{t('license.audio.description')}</LicenseDescription>
      <MediaList>
        {unique.map((audio) => (
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
