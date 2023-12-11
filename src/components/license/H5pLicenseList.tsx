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
import { useLocation } from 'react-router-dom';
import { gql } from '@apollo/client';
import { H5PBold } from '@ndla/icons/editor';
import {
  metaTypes,
  getGroupedContributorDescriptionList,
} from '@ndla/licenses';
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
import CopyTextButton from './CopyTextButton';
import LicenseDescription from './LicenseDescription';
import { licenseListCopyrightFragment } from './licenseFragments';
import { licenseCopyrightToCopyrightType } from './licenseHelpers';
import { GQLH5pLicenseList_H5pLicenseFragment } from '../../graphqlTypes';

interface H5pLicenseInfoProps {
  h5p: GQLH5pLicenseList_H5pLicenseFragment;
}

const H5pLicenseInfo = ({ h5p }: H5pLicenseInfoProps) => {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();
  const safeCopyright = licenseCopyrightToCopyrightType(h5p.copyright);
  const items: ItemType[] = getGroupedContributorDescriptionList(
    safeCopyright,
    i18n.language,
  );
  if (h5p.title) {
    items.unshift({
      label: t('license.images.title'),
      description: h5p.title,
      metaType: metaTypes.title,
    });
  }
  return (
    <MediaListItem>
      <MediaListItemImage canOpen>
        <a
          href={
            pathname.includes('/h5p/') && h5p.src ? h5p.src : `/h5p/${h5p.id}`
          }
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t('embed.goTo', { type: t('embed.type.h5p') })}
        >
          <H5PBold className="c-medialist__icon" />
        </a>
      </MediaListItemImage>
      <MediaListItemBody
        license={h5p.copyright?.license?.license ?? ''}
        title={t('license.h5p.rules')}
        resourceType="h5p"
        resourceUrl={h5p.src}
        locale={i18n.language}
      >
        <MediaListItemActions>
          <div className="c-medialist__ref">
            <MediaListItemMeta items={items} />
            <CopyTextButton
              stringToCopy={`<iframe title="${h5p.title}" aria-label="${h5p.src}" height="400" width="500" frameborder="0" src="${h5p.src}" allowfullscreen=""></iframe>`}
              copyTitle={t('license.embed')}
              hasCopiedTitle={t('license.embedCopied')}
            />
          </div>
        </MediaListItemActions>
      </MediaListItemBody>
    </MediaListItem>
  );
};

interface Props {
  h5ps: GQLH5pLicenseList_H5pLicenseFragment[];
}

const H5pLicenseList = ({ h5ps }: Props) => {
  const { t } = useTranslation();
  const unique = useMemo(() => uniqBy(h5ps, (h5p) => h5p.id), [h5ps]);
  return (
    <div>
      <LicenseDescription>{t('license.h5p.description')}</LicenseDescription>
      <MediaList>
        {unique.map((h5p) => (
          <H5pLicenseInfo h5p={h5p} key={uuid()} />
        ))}
      </MediaList>
    </div>
  );
};

H5pLicenseList.fragments = {
  h5p: gql`
    fragment H5pLicenseList_H5pLicense on H5pLicense {
      id
      title
      src
      copyright {
        ...LicenseListCopyright
      }
    }
    ${licenseListCopyrightFragment}
  `,
};

export default H5pLicenseList;
