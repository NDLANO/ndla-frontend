/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from '@apollo/client';
import { printPage, uuid } from '@ndla/util';
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
import { ButtonV2 } from '@ndla/button';
import { FileDocumentOutline } from '@ndla/icons/common';
import { useTranslation } from 'react-i18next';
import CopyTextButton from './CopyTextButton';
import { GQLTextLicenseList_CopyrightFragment } from '../../graphqlTypes';
import { licenseCopyrightToCopyrightType } from './licenseHelpers';
import { licenseListCopyrightFragment } from './licenseFragments';

interface TextLicenseInfoProps {
  text: TextItem;
}
const TextLicenseInfo = ({ text }: TextLicenseInfoProps) => {
  const { t, i18n } = useTranslation();
  const safeCopyright = licenseCopyrightToCopyrightType(text.copyright);
  const items = getGroupedContributorDescriptionList(
    safeCopyright,
    i18n.language,
  );
  if (text.title) {
    items.unshift({
      label: t('title'),
      description: text.title,
      metaType: metaTypes.other,
    });
  }
  items.push({
    label: t('article.lastUpdated'),
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
        locale={i18n.language}
      >
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
  copyright: GQLTextLicenseList_CopyrightFragment;
  updated: string;
  copyText?: string;
  title?: string;
}

interface Props {
  texts: TextItem[];
  printUrl?: string;
}

const TextLicenseList = ({ texts, printUrl }: Props) => {
  const { t } = useTranslation();
  return (
    <div>
      <h2>{t('license.text.heading')}</h2>
      <p>{t('license.text.description')}</p>
      {printUrl && (
        <ButtonV2
          size="small"
          shape="pill"
          variant="outline"
          onClick={() => printPage(printUrl)}
        >
          {t('article.printPage')}
        </ButtonV2>
      )}
      <MediaList>
        {texts.map((text) => (
          <TextLicenseInfo text={text} key={uuid()} />
        ))}
      </MediaList>
    </div>
  );
};

TextLicenseList.fragments = {
  copyright: gql`
    fragment TextLicenseList_Copyright on Copyright {
      ...LicenseListCopyright
    }
    ${licenseListCopyrightFragment}
  `,
};

export default TextLicenseList;
