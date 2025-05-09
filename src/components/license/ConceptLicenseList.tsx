/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { gql } from "@apollo/client";
import { FileCopyLine, ExternalLinkLine } from "@ndla/icons";
import { metaTypes, getGroupedContributorDescriptionList, figureApa7CopyString } from "@ndla/licenses";
import { SafeLinkButton } from "@ndla/safelink";
import { uniqBy } from "@ndla/util";
import CopyTextButton from "./CopyTextButton";
import { isCopyrighted, licenseCopyrightToCopyrightType } from "./licenseHelpers";
import AddResourceToFolderModal from "../../components/MyNdla/AddResourceToFolderModal";
import config from "../../config";
import {
  GQLConceptLicenseList_ConceptLicenseFragment,
  GQLGlossLicenseList_GlossLicenseFragment,
} from "../../graphqlTypes";
import FavoriteButton from "../Article/FavoritesButton";
import {
  MediaList,
  MediaListItem,
  MediaListItemBody,
  MediaListItemActions,
  MediaListItemMeta,
  ItemType,
  MediaListLicense,
  MediaListContent,
} from "../MediaList/MediaList";

interface ConceptLicenseInfoProps {
  concept: GQLConceptLicenseList_ConceptLicenseFragment | GQLGlossLicenseList_GlossLicenseFragment;
  type: "gloss" | "concept";
}

const ConceptLicenseInfo = ({ concept, type }: ConceptLicenseInfoProps) => {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();

  const pageUrl = `/concept/${concept.id}`;

  const shouldShowLink = useMemo(() => pathname !== pageUrl, [pathname, pageUrl]);

  const src = `${config.ndlaFrontendDomain}/embed-iframe/${i18n.language}/concept/${concept.id}`;
  const safeCopyright = licenseCopyrightToCopyrightType(concept.copyright);
  const items: ItemType[] = getGroupedContributorDescriptionList(safeCopyright, i18n.language);
  if (concept.title) {
    items.unshift({
      label: t("title"),
      description: concept.title,
      metaType: metaTypes.title,
    });
  }
  if (concept.copyright?.origin) {
    items.push({
      label: t("source"),
      description: concept.copyright.origin,
      metaType: metaTypes.other,
    });
  }
  if (concept.copyright?.processed === true) {
    items.push({
      label: t("license.processed"),
      metaType: metaTypes.otherWithoutDescription,
    });
  }

  const copyText = figureApa7CopyString(
    concept.title,
    undefined,
    concept.src,
    `${config.ndlaFrontendDomain}/concept/${concept.id}`,
    concept.copyright,
    concept.copyright?.license?.license,
    "",
    (id: string) => t(id),
    i18n.language,
  );

  return (
    <MediaListItem>
      <MediaListItemBody
        license={concept.copyright?.license?.license ?? ""}
        resourceUrl={concept.src}
        locale={i18n.language}
      >
        <MediaListContent>
          <MediaListLicense
            licenseType={concept.copyright?.license?.license ?? ""}
            title={t(`license.${type}.rules`)}
            sourceTitle={concept.title}
            sourceType={type}
          >
            {!isCopyrighted(concept.copyright?.license?.license) && (
              <AddResourceToFolderModal
                resource={{
                  id: concept.id,
                  path: `/concept/${concept.id}`,
                  resourceType: "concept",
                }}
              >
                <FavoriteButton path={`/concept/${concept.id}`} />
              </AddResourceToFolderModal>
            )}
          </MediaListLicense>
          {!isCopyrighted(concept.copyright?.license?.license) && (
            <MediaListItemActions>
              <CopyTextButton
                stringToCopy={`<iframe title="${concept.title}" aria-label="${concept.title}" height="400" width="500" frameborder="0" src="${src}" allowfullscreen=""></iframe>`}
                copyTitle={t("license.embed")}
                hasCopiedTitle={t("license.embedCopied")}
              />
              {!!shouldShowLink && (
                <SafeLinkButton to={pageUrl} target="_blank" rel="noopener noreferrer" variant="secondary" size="small">
                  <ExternalLinkLine />
                  {t("license.openLink")}
                </SafeLinkButton>
              )}
            </MediaListItemActions>
          )}
        </MediaListContent>
        <MediaListItemActions>
          <MediaListContent>
            <MediaListItemMeta items={items} />
            {!isCopyrighted(concept.copyright?.license?.license) && !!copyText && (
              <CopyTextButton
                stringToCopy={copyText}
                copyTitle={t("license.copyTitle")}
                hasCopiedTitle={t("license.hasCopiedTitle")}
              >
                <FileCopyLine />
              </CopyTextButton>
            )}
          </MediaListContent>
        </MediaListItemActions>
      </MediaListItemBody>
    </MediaListItem>
  );
};

interface Props {
  concepts: GQLConceptLicenseList_ConceptLicenseFragment[];
}

const ConceptLicenseList = ({ concepts }: Props) => {
  const unique = useMemo(() => uniqBy(concepts, (concept) => concept.id), [concepts]);
  return (
    <MediaList>
      {unique.map((concept, index) => (
        <ConceptLicenseInfo type="concept" concept={concept} key={index} />
      ))}
    </MediaList>
  );
};

interface GlossLicenseListProps {
  glosses: GQLGlossLicenseList_GlossLicenseFragment[];
}

export const GlossLicenseList = ({ glosses }: GlossLicenseListProps) => {
  const unique = useMemo(() => uniqBy(glosses, (gloss) => gloss.id), [glosses]);

  return (
    <MediaList>
      {unique.map((gloss, index) => (
        <ConceptLicenseInfo type="gloss" concept={gloss} key={index} />
      ))}
    </MediaList>
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
