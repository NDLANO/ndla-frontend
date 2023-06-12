/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from '@apollo/client';
import {
  MediaList,
  MediaListItem,
  MediaListItemImage,
  MediaListItemBody,
  MediaListItemActions,
  MediaListItemMeta,
} from '@ndla/ui';
import { Podcast } from '@ndla/icons/common';
import {
  figureApa7CopyString,
  getGroupedContributorDescriptionList,
  metaTypes,
} from '@ndla/licenses';
import { useTranslation } from 'react-i18next';
import { SafeLinkButton } from '@ndla/safelink';
import { Link } from 'react-router-dom';
import CopyTextButton from './CopyTextButton';
import { GQLPodcastLicenseList_PodcastLicenseFragment } from '../../graphqlTypes';
import {
  isCopyrighted,
  licenseCopyrightToCopyrightType,
} from './licenseHelpers';
import { licenseListCopyrightFragment } from './licenseFragments';
import config from '../../config';
import LicenseDescription from './LicenseDescription';

interface PodcastLicenseInfoProps {
  podcast: GQLPodcastLicenseList_PodcastLicenseFragment;
}

const PodcastLicenseInfo = ({ podcast }: PodcastLicenseInfoProps) => {
  const { t, i18n } = useTranslation();
  const safeCopyright = licenseCopyrightToCopyrightType(podcast.copyright);
  const items = getGroupedContributorDescriptionList(
    safeCopyright,
    i18n.language,
  );

  const copyText = figureApa7CopyString(
    podcast.title,
    undefined,
    podcast.src,
    `${config.ndlaFrontendDomain}/audio/${podcast.id}`,
    podcast.copyright,
    podcast.copyright.license.license,
    '',
    (id: string) => t(id),
    i18n.language,
  );

  if (podcast.title) {
    items.unshift({
      label: t('title'),
      description: podcast.title,
      metaType: metaTypes.title,
    });
  }
  if (podcast.copyright.origin) {
    items.push({
      label: t('source'),
      description: podcast.copyright.origin,
      metaType: metaTypes.other,
    });
  }

  return (
    <MediaListItem>
      <MediaListItemImage>
        {isCopyrighted(podcast.copyright.license.license) ? (
          <Podcast className="c-medialist__icon" />
        ) : (
          <Link
            to={`/audio/${podcast.id}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('embed.goTo', { type: t('embed.type.podcast') })}
          >
            <Podcast className="c-medialist__icon" />
          </Link>
        )}
      </MediaListItemImage>

      <MediaListItemBody
        title={t('license.podcast.rules')}
        license={podcast.copyright.license?.license}
        resourceType="podcast"
        resourceUrl={podcast.src}
        locale={i18n.language}
      >
        <MediaListItemActions>
          <div className="c-medialist__ref">
            <MediaListItemMeta items={items} />
            {podcast.copyright.license?.license !== 'COPYRIGHTED' && (
              <>
                {copyText && (
                  <CopyTextButton
                    stringToCopy={copyText}
                    copyTitle={t('license.copyTitle')}
                    hasCopiedTitle={t('license.hasCopiedTitle')}
                  />
                )}
                <SafeLinkButton to={podcast.src} download variant="outline">
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
  podcasts: GQLPodcastLicenseList_PodcastLicenseFragment[];
}

const PodcastLicenseList = ({ podcasts }: Props) => {
  const { t } = useTranslation();
  return (
    <div>
      <LicenseDescription>
        {t('license.podcast.description')}
      </LicenseDescription>
      <MediaList>
        {podcasts.map((podcast, index) => (
          <PodcastLicenseInfo
            podcast={podcast}
            key={`${podcast.id}-${index}`}
          />
        ))}
      </MediaList>
    </div>
  );
};

PodcastLicenseList.fragments = {
  podcast: gql`
    fragment PodcastLicenseList_PodcastLicense on PodcastLicense {
      id
      src
      copyText
      title
      description
      copyright {
        origin
        ...LicenseListCopyright
      }
    }
    ${licenseListCopyrightFragment}
  `,
};

export default PodcastLicenseList;
