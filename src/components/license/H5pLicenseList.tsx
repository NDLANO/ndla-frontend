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
  MediaList,
  MediaListItem,
  MediaListItemImage,
  MediaListItemBody,
  MediaListItemActions,
  MediaListItemMeta,
} from '@ndla/ui';
import {
  metaTypes,
  getGroupedContributorDescriptionList,
} from '@ndla/licenses';
import { H5PBold } from '@ndla/icons/editor';
import { useTranslation } from 'react-i18next';
import { GQLH5pLicense } from '../../graphqlTypes';
import CopyTextButton from './CopyTextButton';
import { LocaleType } from '../../interfaces';
import { licenseCopyrightToCopyrightType } from './licenseHelpers';

interface H5pLicenseInfoProps {
  h5p: GQLH5pLicense;
  locale: LocaleType;
}

const H5pLicenseInfo = ({ h5p, locale }: H5pLicenseInfoProps) => {
  const { t } = useTranslation();
  const safeCopyright = licenseCopyrightToCopyrightType(h5p.copyright);
  const items = getGroupedContributorDescriptionList(safeCopyright, locale);
  if (h5p.title) {
    items.unshift({
      label: t('license.images.title'),
      description: h5p.title,
      metaType: metaTypes.title,
    });
  }
  return (
    <MediaListItem>
      <MediaListItemImage>
        <a href={h5p.src} target="_blank" rel="noopener noreferrer">
          <H5PBold className="c-medialist__icon" />
        </a>
      </MediaListItemImage>
      <MediaListItemBody
        license={h5p.copyright.license?.license}
        title={t('license.h5p.rules')}
        resourceType="h5p"
        resourceUrl={h5p.src}
        locale={locale}>
        <MediaListItemActions>
          <div className="c-medialist__ref">
            <MediaListItemMeta items={items} />
            {h5p.copyText && (
              <CopyTextButton
                stringToCopy={h5p.copyText}
                copyTitle={t('license.copyTitle')}
                hasCopiedTitle={t('license.hasCopiedTitle')}
              />
            )}
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
  h5ps: GQLH5pLicense[];
  locale: LocaleType;
}

const H5pLicenseList = ({ h5ps, locale }: Props) => {
  const { t } = useTranslation();
  return (
    <div>
      <h2>{t('license.h5p.heading')}</h2>
      <p>{t('license.h5p.description')}</p>
      <MediaList>
        {h5ps.map(h5p => (
          <H5pLicenseInfo h5p={h5p} key={uuid()} locale={locale} />
        ))}
      </MediaList>
    </div>
  );
};

export default H5pLicenseList;
