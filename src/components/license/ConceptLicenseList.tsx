/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from '@apollo/client';
import {
  MediaList,
  MediaListItem,
  MediaListItemImage,
  MediaListItemBody,
  MediaListItemActions,
  MediaListItemMeta,
  ItemType,
} from '@ndla/ui';
import {
  metaTypes,
  getGroupedContributorDescriptionList,
} from '@ndla/licenses';
import { Concept } from '@ndla/icons/editor';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import uniqBy from 'lodash/uniqBy';
import CopyTextButton from './CopyTextButton';
import { GQLConceptLicenseList_ConceptLicenseFragment } from '../../graphqlTypes';
import {
  isCopyrighted,
  licenseCopyrightToCopyrightType,
} from './licenseHelpers';
import config from '../../config';
import LicenseDescription from './LicenseDescription';

interface ConceptLicenseInfoProps {
  concept: GQLConceptLicenseList_ConceptLicenseFragment;
}

const ConceptLicenseInfo = ({ concept }: ConceptLicenseInfoProps) => {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();
  if (
    concept.copyright?.license?.license === undefined ||
    concept.copyright.license.license === 'unknown'
  )
    return null;

  const pageUrl = `/concept/${concept.id}`;

  const shouldShowLink =
    pathname !== pageUrl && !isCopyrighted(concept.copyright.license.license);

  const src = `${config.ndlaFrontendDomain}/embed-iframe/${i18n.language}/concept/${concept.id}`;
  const safeCopyright = licenseCopyrightToCopyrightType(concept.copyright);
  const items: ItemType[] = getGroupedContributorDescriptionList(
    safeCopyright,
    i18n.language,
  );
  if (concept.title) {
    items.unshift({
      label: t('license.concept.title'),
      description: concept.title,
      metaType: metaTypes.title,
    });
  }
  if (concept.copyright.origin) {
    items.push({
      label: t('source'),
      description: concept.copyright.origin,
      metaType: metaTypes.other,
    });
  }
  if (concept.copyright.processed === true) {
    items.push({
      label: t('license.processed'),
      metaType: metaTypes.otherWithoutDescription,
    });
  }

  return (
    <MediaListItem>
      <MediaListItemImage canOpen={shouldShowLink}>
        {!shouldShowLink ? (
          <Concept className="c-medialist__icon" />
        ) : (
          <Link
            to={pageUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('embed.goTo', { type: t('embed.type.concept') })}
          >
            <Concept className="c-medialist__icon" />
          </Link>
        )}
      </MediaListItemImage>
      <MediaListItemBody
        license={concept.copyright.license.license}
        title={t('license.concept.rules')}
        resourceUrl={concept.src}
        locale={i18n.language}
      >
        <MediaListItemActions>
          <div className="c-medialist__ref">
            <MediaListItemMeta items={items} />
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

interface Props {
  concepts: GQLConceptLicenseList_ConceptLicenseFragment[];
}

const ConceptLicenseList = ({ concepts }: Props) => {
  const { t } = useTranslation();
  const unique = useMemo(
    () => uniqBy(concepts, (concept) => concept.id),
    [concepts],
  );
  return (
    <div>
      <LicenseDescription>
        {t('license.concept.description')}
      </LicenseDescription>
      <MediaList>
        {unique.map((concept, index) => (
          <ConceptLicenseInfo concept={concept} key={index} />
        ))}
      </MediaList>
    </div>
  );
};

ConceptLicenseList.fragments = {
  concept: gql`
    fragment ConceptLicenseList_ConceptLicense on ConceptLicense {
      id
      title
      src
      copyright {
        license {
          license
        }
        creators {
          name
          type
        }
        processors {
          name
          type
        }
        rightsholders {
          name
          type
        }
        origin
        processed
      }
    }
  `,
};

export default ConceptLicenseList;
