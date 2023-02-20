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
import { Podcast } from '@ndla/icons/common';
import {
  figureApa7CopyString,
  getGroupedContributorDescriptionList,
  metaTypes,
} from '@ndla/licenses';
import { useTranslation } from 'react-i18next';
import { SafeLinkButton } from '@ndla/safelink';
import CopyTextButton from './CopyTextButton';
import { GQLPodcastLicenseList_PodcastLicenseFragment } from '../../graphqlTypes';
import { licenseCopyrightToCopyrightType } from './licenseHelpers';
import { licenseListCopyrightFragment } from './licenseFragments';
import config from '../../config';
import { useArticleConverterEnabled } from '../ArticleConverterContext';

interface PodcastLicenseInfoProps {
  podcast: GQLPodcastLicenseList_PodcastLicenseFragment;
  articleId?: number;
}

const PodcastLicenseInfo = ({
  podcast,
  articleId,
}: PodcastLicenseInfoProps) => {
  const { t, i18n } = useTranslation();
  const safeCopyright = licenseCopyrightToCopyrightType(podcast.copyright);
  const articleConverterEnabled = useArticleConverterEnabled();
  const items = getGroupedContributorDescriptionList(
    safeCopyright,
    i18n.language,
  );

  const copyText = articleConverterEnabled
    ? podcast.copyText
    : figureApa7CopyString(
        podcast.title,
        undefined,
        podcast.src,
        `${config.ndlaFrontendDomain}/article/${articleId}`,
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
        <Podcast className="c-medialist__icon" />
      </MediaListItemImage>

      <MediaListItemBody
        title={t('license.podcast.rules')}
        license={podcast.copyright.license?.license}
        resourceType="podcast"
        resourceUrl={podcast.src}
        locale={i18n.language}>
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
  articleId?: number;
}

const PodcastLicenseList = ({ podcasts, articleId }: Props) => {
  const { t } = useTranslation();
  return (
    <div>
      <h2>{t('license.podcast.heading')}</h2>
      <p>{t('license.podcast.description')}</p>
      <MediaList>
        {podcasts.map(podcast => (
          <PodcastLicenseInfo
            podcast={podcast}
            articleId={articleId}
            key={uuid()}
          />
        ))}
      </MediaList>
    </div>
  );
};

PodcastLicenseList.fragments = {
  podcast: gql`
    fragment PodcastLicenseList_PodcastLicense on PodcastLicense {
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
