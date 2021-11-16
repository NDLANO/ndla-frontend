/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import PropTypes from 'prop-types';
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
import { CopyrightObjectShape } from '../../shapes';

const TextShape = PropTypes.shape({
  copyright: CopyrightObjectShape.isRequired,
  src: PropTypes.string.isRequired,
  updated: PropTypes.string.isRequired,
  copyText: PropTypes.string,
});

const TextLicenseInfo = ({ text, locale }) => {
  const { t } = useTranslation();
  const items = getGroupedContributorDescriptionList(text.copyright, locale);
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
        license={text.copyright.license.license}
        title={t('license.text.rules')}
        resourceType="text"
        resourceUrl={text.src}
        locale={locale}>
        <MediaListItemActions>
          <div className="c-medialist__ref">
            <MediaListItemMeta items={items} />
            <CopyTextButton
              stringToCopy={text.copyText}
              copyTitle={t('license.copyTitle')}
              hasCopiedTitle={t('license.hasCopiedTitle')}
            />
          </div>
        </MediaListItemActions>
      </MediaListItemBody>
    </MediaListItem>
  );
};

TextLicenseInfo.propTypes = {
  locale: PropTypes.string.isRequired,
  text: TextShape,
};

const TextLicenseList = ({ texts, locale }) => {
  const { t } = useTranslation();
  return (
    <div>
      <h2>{t('license.text.heading')}</h2>
      <p>{t('license.text.description')}</p>
      <MediaList>
        {texts.map(text => (
          <TextLicenseInfo text={text} key={uuid()} locale={locale} t={t} />
        ))}
      </MediaList>
    </div>
  );
};

TextLicenseList.propTypes = {
  locale: PropTypes.string.isRequired,
  texts: PropTypes.arrayOf(TextShape),
};

export default TextLicenseList;
