/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { uuid } from 'ndla-util';
import {
  MediaList,
  MediaListItem,
  MediaListItemImage,
  MediaListItemBody,
  MediaListItemActions,
  MediaListItemMeta,
} from 'ndla-ui';
import { metaTypes, getGroupedContributorDescriptionList } from 'ndla-licenses';
import { Document } from 'ndla-icons/common';
import { injectT } from 'ndla-i18n';
import CopyTextButton from './CopyTextButton';
import { CopyrightObjectShape } from '../../shapes';
import { getCopyrightCopyString } from './getCopyrightCopyString';

const TextShape = PropTypes.shape({
  copyright: CopyrightObjectShape.isRequired,
});

const TextLicenseInfo = ({ text, locale, t }) => {
  const items = getGroupedContributorDescriptionList(text.copyright, locale);
  items.push({
    label: t('text.published'),
    description: text.updated,
    metaType: metaTypes.other,
  });

  return (
    <MediaListItem>
      <MediaListItemImage>
        <Document className="c-medialist__icon" />
      </MediaListItemImage>
      <MediaListItemBody
        license={text.copyright.license.license}
        title={t('text.rules')}
        resourceType="text"
        resourceUrl={text.src}
        locale={locale}>
        <MediaListItemActions>
          <div className="c-medialist__ref">
            <MediaListItemMeta items={items} />
            <CopyTextButton
              stringToCopy={getCopyrightCopyString(text.copyright, t)}
              t={t}
              copyTitle={t('copyTitle')}
              hasCopiedTitle={t('hasCopiedTitle')}
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

const TextLicenseList = ({ texts, locale, t }) => (
  <div>
    <h2>{t('text.heading')}</h2>
    <p>{t('text.description')}</p>
    <MediaList>
      {texts.map(text => (
        <TextLicenseInfo text={text} key={uuid()} locale={locale} t={t} />
      ))}
    </MediaList>
  </div>
);

TextLicenseList.propTypes = {
  locale: PropTypes.string.isRequired,
  texts: PropTypes.arrayOf(TextShape),
};

export default injectT(TextLicenseList, 'license.');
