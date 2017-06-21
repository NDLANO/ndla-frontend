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
  Icon,
  MediaList,
  MediaListItem,
  MediaListItemImage,
  MediaListItemBody,
  MediaListItemActions,
} from 'ndla-ui';
import { injectT } from '../../i18n';
import { MediaListItemMeta } from './MediaList';
import CopyTextButton from './CopyTextButton';
import { CopyrightObjectShape } from '../../shapes';

const TextLicenseInfo = ({ text, locale, t }) =>
  <MediaListItem>
    <MediaListItemImage>
      <Icon.Document className="c-medialist__icon" />
    </MediaListItemImage>
    <MediaListItemBody
      license={text.copyright.license.license}
      title={t('rules')}
      locale={locale}>
      <MediaListItemActions>
        <h3 className="c-medialist__title">
          {t('howToReference')}
        </h3>
        <MediaListItemMeta authors={text.copyright.authors} />
        <CopyTextButton
          authors={text.copyright.authors}
          copyTitle={t('copyTitle')}
          hasCopiedTitle={t('hasCopiedTitle')}
        />
      </MediaListItemActions>
    </MediaListItemBody>
  </MediaListItem>;

TextLicenseInfo.propTypes = {
  locale: PropTypes.string.isRequired,
  text: CopyrightObjectShape,
};

const TextLicenseList = ({ texts, heading, description, locale, t }) =>
  <div>
    <h2>{heading}</h2>
    <p>{description}</p>
    <MediaList>
      {texts.map(text =>
        <TextLicenseInfo text={text} key={uuid()} locale={locale} t={t} />,
      )}
    </MediaList>
  </div>;

TextLicenseList.propTypes = {
  heading: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  texts: PropTypes.arrayOf(CopyrightObjectShape),
};

export default injectT(TextLicenseList, 'license.texts.');
