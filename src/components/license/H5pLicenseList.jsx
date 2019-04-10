/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
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
  // metaTypes,
  getGroupedContributorDescriptionList,
} from '@ndla/licenses';
import { FileDocumentOutline } from '@ndla/icons/common';
import { injectT } from '@ndla/i18n';
import CopyTextButton from './CopyTextButton';
import { CopyrightObjectShape } from '../../shapes';
import { getCopyrightCopyString } from './getCopyrightCopyString';

const TextShape = PropTypes.shape({
  copyright: CopyrightObjectShape.isRequired,
});

const H5pLicenseInfo = ({ text, locale, t }) => {
  const items = getGroupedContributorDescriptionList(text, locale);
  // items.push({
  //   label: t('text.published'),
  //   description: text.license.description,
  //   metaType: metaTypes.h5p,
  // });

  return (
    <MediaListItem>
      <MediaListItemImage>
        <FileDocumentOutline className="c-medialist__icon" />
      </MediaListItemImage>
      <MediaListItemBody
        license={text.license.license}
        title={t('text.rules')}
        resourceType="h5p"
        resourceUrl={text.origin}
        locale={locale}>
        <MediaListItemActions>
          <div className="c-medialist__ref">
            <MediaListItemMeta items={items} />
            <CopyTextButton
              stringToCopy={getCopyrightCopyString(text, t)}
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

H5pLicenseInfo.propTypes = {
  locale: PropTypes.string.isRequired,
  text: TextShape,
};

const H5pLicenseList = ({ texts, locale, t }) => (
  <div>
    <h2>{t('text.heading')}</h2>
    <p>{t('text.description')}</p>
    <MediaList>
      {texts.map(text => (
        <H5pLicenseInfo text={text} key={uuid()} locale={locale} t={t} />
      ))}
    </MediaList>
  </div>
);

H5pLicenseList.propTypes = {
  locale: PropTypes.string.isRequired,
  h5ps: PropTypes.arrayOf(TextShape),
};

export default injectT(H5pLicenseList, 'license.');
