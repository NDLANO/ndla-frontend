/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

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
import { Concept } from '@ndla/icons/editor';
import { useTranslation } from 'react-i18next';
import CopyTextButton from './CopyTextButton';
import { ConceptLicenseShape } from '../../shapes';

const ConceptLicenseInfo = ({ concept, locale }) => {
  const { t } = useTranslation();
  if (
    concept.copyright?.license?.license === undefined ||
    concept.copyright.license.license === 'unknown'
  )
    return null;

  const src = `${concept.src}/${locale}`;
  const items = getGroupedContributorDescriptionList(concept.copyright, locale);
  if (concept.title) {
    items.unshift({
      label: t('license.concept.title'),
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
        title={t('license.concept.rules')}
        resourceType="concept"
        resourceUrl={concept.src}
        locale={locale}>
        <MediaListItemActions>
          <div className="c-medialist__ref">
            <MediaListItemMeta items={items} />
            <CopyTextButton
              stringToCopy={concept.copyText}
              t={t}
              copyTitle={t('license.copyTitle')}
              hasCopiedTitle={t('license.hasCopiedTitle')}
            />
            <CopyTextButton
              stringToCopy={`<iframe title="${concept.title}" aria-label="${concept.title}" height="400" width="500" frameborder="0" src="${src}" allowfullscreen=""></iframe>`}
              copyTitle={t('license.embed')}
              hasCopiedTitle={t('license.embedCopied')}
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

const ConceptLicenseList = ({ concepts, locale }) => {
  const { t } = useTranslation();
  return (
    <div>
      <h2>{t('license.concept.heading')}</h2>
      <p>{t('license.concept.description')}</p>
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
};

ConceptLicenseList.propTypes = {
  locale: PropTypes.string.isRequired,
  concepts: PropTypes.arrayOf(ConceptLicenseShape),
};

export default ConceptLicenseList;
