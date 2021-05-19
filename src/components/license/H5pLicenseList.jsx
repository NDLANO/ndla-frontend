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
  metaTypes,
  getGroupedContributorDescriptionList,
} from '@ndla/licenses';
import { H5PBold } from '@ndla/icons/editor';
import { injectT } from '@ndla/i18n';
import CopyTextButton from './CopyTextButton';
import { CopyrightObjectShape, H5pShape } from '../../shapes';

const TextShape = PropTypes.shape({
  copyright: CopyrightObjectShape.isRequired,
});

const H5pLicenseInfo = ({ h5p, locale, t }) => {
  const items = getGroupedContributorDescriptionList(h5p.copyright, locale);
  if (h5p.title) {
    items.unshift({
      label: t('images.title'),
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
        license={h5p.copyright.license.license}
        title={t('h5p.rules')}
        resourceType="h5p"
        resourceUrl={h5p.src}
        locale={locale}>
        <MediaListItemActions>
          <div className="c-medialist__ref">
            <MediaListItemMeta items={items} />
            <CopyTextButton
              stringToCopy={h5p.copyText}
              t={t}
              copyTitle={t('copyTitle')}
              hasCopiedTitle={t('hasCopiedTitle')}
            />
            <CopyTextButton
              stringToCopy={`<iframe title="${h5p.title}" aria-label="${h5p.src}" height="400" width="500" frameborder="0" src="${h5p.src}" allowfullscreen=""></iframe>`}
              t={t}
              copyTitle={t('embed')}
              hasCopiedTitle={t('embedCopied')}
            />
          </div>
        </MediaListItemActions>
      </MediaListItemBody>
    </MediaListItem>
  );
};

H5pLicenseInfo.propTypes = {
  locale: PropTypes.string.isRequired,
  h5p: H5pShape,
};

const H5pLicenseList = ({ h5ps, locale, t }) => (
  <div>
    <h2>{t('h5p.heading')}</h2>
    <p>{t('h5p.description')}</p>
    <MediaList>
      {h5ps.map(h5p => (
        <H5pLicenseInfo h5p={h5p} key={uuid()} locale={locale} t={t} />
      ))}
    </MediaList>
  </div>
);

H5pLicenseList.propTypes = {
  locale: PropTypes.string.isRequired,
  h5ps: PropTypes.arrayOf(TextShape),
};

export default injectT(H5pLicenseList, 'license.');
