/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import uniqBy from 'lodash/uniqBy';
import { ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { gql } from '@apollo/client';
import { Concept, Globe } from '@ndla/icons/editor';
import {
  metaTypes,
  getGroupedContributorDescriptionList,
} from '@ndla/licenses';
import {
  MediaList,
  MediaListItem,
  MediaListItemImage,
  MediaListItemBody,
  MediaListItemActions,
  MediaListItemMeta,
  ItemType,
} from '@ndla/ui';
import CopyTextButton from './CopyTextButton';
import LicenseDescription from './LicenseDescription';
import {
  isCopyrighted,
  licenseCopyrightToCopyrightType,
} from './licenseHelpers';
import config from '../../config';
import {
  GQLConceptLicenseList_ConceptLicenseFragment,
  GQLGlossLicenseList_GlossLicenseFragment,
} from '../../graphqlTypes';

interface ConceptLicenseInfoProps {
  concept:
    | GQLConceptLicenseList_ConceptLicenseFragment
    | GQLGlossLicenseList_GlossLicenseFragment;
  icon: ReactNode;
  type: 'gloss' | 'concept';
}

const ConceptLicenseInfo = ({
  concept,
  icon,
  type,
}: ConceptLicenseInfoProps) => {
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
      label: t(`license.${type}.title`),
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
          icon
        ) : (
          <Link
            to={pageUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('embed.goTo', { type: t(`embed.type.${type}`) })}
          >
            {icon}
          </Link>
        )}
      </MediaListItemImage>
      <MediaListItemBody
        license={concept.copyright.license.license}
        title={t(`license.${type}.rules`)}
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
          <ConceptLicenseInfo
            type="concept"
            concept={concept}
            key={index}
            icon={<Concept className="c-medialist__icon" />}
          />
        ))}
      </MediaList>
    </div>
  );
};

interface GlossLicenseListProps {
  glosses: GQLGlossLicenseList_GlossLicenseFragment[];
}

export const GlossLicenseList = ({ glosses }: GlossLicenseListProps) => {
  const { t } = useTranslation();
  const unique = useMemo(() => uniqBy(glosses, (gloss) => gloss.id), [glosses]);

  return (
    <div>
      <LicenseDescription>{t('license.gloss.description')}</LicenseDescription>
      <MediaList>
        {unique.map((gloss, index) => (
          <ConceptLicenseInfo
            type="gloss"
            concept={gloss}
            key={index}
            icon={<Globe className="c-medialist__icon" />}
          />
        ))}
      </MediaList>
    </div>
  );
};

GlossLicenseList.fragments = {
  gloss: gql`
    fragment GlossLicenseList_GlossLicense on GlossLicense {
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
