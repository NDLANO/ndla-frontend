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
import { FileDocumentOutline } from '@ndla/icons/common';
import { useTranslation } from 'react-i18next';
import CopyTextButton from './CopyTextButton';
import { GQLCopyrightInfoFragment } from '../../graphqlTypes';
import { LocaleType } from '../../interfaces';
import { licenseCopyrightToCopyrightType } from './licenseHelpers';

interface TextLicenseInfoProps {
  text: TextItem;
  locale: LocaleType;
}
const TextLicenseInfo = ({ text, locale }: TextLicenseInfoProps) => {
  const { t } = useTranslation();
  const safeCopyright = licenseCopyrightToCopyrightType(text.copyright);
  const items = getGroupedContributorDescriptionList(safeCopyright, locale);
  if (text.title) {
    items.unshift({
      label: t('title'),
      description: text.title,
      metaType: metaTypes.other,
    });
  }
  items.push({
    label: t('license.text.published'),
    description: text.updated,
    metaType: metaTypes.other,
  });

  return (
    <MediaListItem>
      <MediaListItemImage>
        <FileDocumentOutline className="c-medialist__icon" />
      </MediaListItemImage>
      <MediaListItemBody
        license={text.copyright.license?.license}
        title={t('license.text.rules')}
        resourceType="text"
        locale={locale}>
        <MediaListItemActions>
          <div className="c-medialist__ref">
            <MediaListItemMeta items={items} />
            {text.copyText && (
              <CopyTextButton
                stringToCopy={text.copyText}
                copyTitle={t('license.copyTitle')}
                hasCopiedTitle={t('license.hasCopiedTitle')}
              />
            )}
          </div>
        </MediaListItemActions>
      </MediaListItemBody>
    </MediaListItem>
  );
};

interface TextItem {
  copyright: GQLCopyrightInfoFragment;
  updated: string;
  copyText?: string;
  title?: string;
}

interface Props {
  texts: TextItem[];
  locale: LocaleType;
}

const TextLicenseList = ({ texts, locale }: Props) => {
  const { t } = useTranslation();
  return (
    <div>
      <h2>{t('license.text.heading')}</h2>
      <p>{t('license.text.description')}</p>
      <MediaList>
        {texts.map(text => (
          <TextLicenseInfo text={text} key={uuid()} locale={locale} />
        ))}
      </MediaList>
    </div>
  );
};

export default TextLicenseList;
