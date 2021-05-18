/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
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
import { injectT } from '@ndla/i18n';
import { Concept } from '@ndla/icons/editor';
import CopyTextButton from './CopyTextButton';
import { ConceptLicenseShape } from '../../shapes';
import { getCopyrightCopyString } from './getCopyrightCopyString';

const ConceptLicenseInfo = ({ concept, locale, t }) => {
  if (
    concept.copyright?.license?.license === undefined ||
    concept.copyright.license.license === 'unknown'
  )
    return null;

  const src = `${concept.src}/${locale}`;
  const items = getGroupedContributorDescriptionList(concept.copyright, locale);
  if (concept.title) {
    items.unshift({
      label: t('concept.title'),
      description: concept.title,
      metaType: metaTypes.title,
    });
  }
  return (
    <MediaListItem>
      <MediaListItemImage>
        <a href={src} target="_blank" rel="noopener noreferrer">
          <Concept className="c-medialist__icon" />
        </a>
      </MediaListItemImage>
      <MediaListItemBody
        license={concept.copyright.license.license}
        title={t('concept.rules')}
        resourceType="concept"
        resourceUrl={concept.src}
        locale={locale}>
        <MediaListItemActions>
          <div className="c-medialist__ref">
            <MediaListItemMeta items={items} />
            <CopyTextButton
              stringToCopy={concept.copyText}
              t={t}
              copyTitle={t('copyTitle')}
              hasCopiedTitle={t('hasCopiedTitle')}
            />
            <CopyTextButton
              stringToCopy={`<iframe title="${concept.title}" aria-label="${concept.title}" height="400" width="500" frameborder="0" src="${src}" allowfullscreen=""></iframe>`}
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

ConceptLicenseInfo.propTypes = {
  locale: PropTypes.string.isRequired,
  concept: ConceptLicenseShape,
};

const ConceptLicenseList = ({ concepts, locale, t }) => (
  <div>
    <h2>{t('concept.heading')}</h2>
    <p>{t('concept.description')}</p>
    <MediaList>
      {concepts.map((concept, index) => (
        <ConceptLicenseInfo
          concept={concept}
          key={index}
          locale={locale}
          t={t}
        />
      ))}
    </MediaList>
  </div>
);

ConceptLicenseList.propTypes = {
  locale: PropTypes.string.isRequired,
  concepts: PropTypes.arrayOf(ConceptLicenseShape),
};

export default injectT(ConceptLicenseList, 'license.');
