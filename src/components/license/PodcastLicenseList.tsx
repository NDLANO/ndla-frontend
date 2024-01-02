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
import { Podcast } from '@ndla/icons/common';
import { figureApa7CopyString, getGroupedContributorDescriptionList, metaTypes } from '@ndla/licenses';
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
import CopyTextButton from './CopyTextButton';
import LicenseDescription from './LicenseDescription';
import { licenseListCopyrightFragment } from './licenseFragments';
import { isCopyrighted, licenseCopyrightToCopyrightType } from './licenseHelpers';
import { MediaListRef, mediaListIcon } from './licenseStyles';
import config from '../../config';
import { GQLPodcastLicenseList_PodcastLicenseFragment } from '../../graphqlTypes';

interface PodcastLicenseInfoProps {
  podcast: GQLPodcastLicenseList_PodcastLicenseFragment;
}

const PodcastLicenseInfo = ({ podcast }: PodcastLicenseInfoProps) => {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();

  const pageUrl = useMemo(() => `/audio/${podcast.id}`, [podcast.id]);

  const shouldShowLink = useMemo(
    () => pathname !== pageUrl && !isCopyrighted(podcast.copyright.license.license),
    [pageUrl, pathname, podcast.copyright.license.license],
  );

  const safeCopyright = licenseCopyrightToCopyrightType(podcast.copyright);
  const items: ItemType[] = getGroupedContributorDescriptionList(safeCopyright, i18n.language);

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

  if (podcast.copyright.processed === true) {
    items.push({
      label: t('license.processed'),
      metaType: metaTypes.otherWithoutDescription,
    });
  }

  return (
    <MediaListItem>
      <MediaListItemImage canOpen={shouldShowLink}>
        {!shouldShowLink ? (
          <Podcast css={mediaListIcon} />
        ) : (
          <Link
            to={pageUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('embed.goTo', { type: t('embed.type.podcast') })}
          >
            <Podcast css={mediaListIcon} />
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
          <MediaListRef>
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
          </MediaListRef>
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

  const unique = useMemo(() => uniqBy(podcasts, (p) => p.id), [podcasts]);

  return (
    <div>
      <LicenseDescription>{t('license.podcast.description')}</LicenseDescription>
      <MediaList>
        {unique.map((podcast, index) => (
          <PodcastLicenseInfo podcast={podcast} key={`${podcast.id}-${index}`} />
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
