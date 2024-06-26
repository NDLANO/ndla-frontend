/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import uniqBy from "lodash/uniqBy";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { gql } from "@apollo/client";
import styled from "@emotion/styled";
import { spacing } from "@ndla/core";
import { Copy } from "@ndla/icons/action";
import { Download, Launch } from "@ndla/icons/common";
import { metaTypes, getGroupedContributorDescriptionList, figureApa7CopyString } from "@ndla/licenses";
import { SafeLinkButton } from "@ndla/safelink";
import CopyTextButton from "./CopyTextButton";
import { downloadUrl } from "./ImageLicenseList";
import { isCopyrighted, licenseCopyrightToCopyrightType } from "./licenseHelpers";
import { MediaListRef } from "./licenseStyles";
import FavoriteButton from "../../components/Article/FavoritesButton";
import AddResourceToFolderModal from "../../components/MyNdla/AddResourceToFolderModal";
import config from "../../config";
import {
  GQLConceptLicenseList_ConceptLicenseFragment,
  GQLGlossLicenseList_GlossLicenseFragment,
} from "../../graphqlTypes";
import {
  MediaList,
  MediaListItem,
  MediaListItemBody,
  MediaListItemActions,
  MediaListItemMeta,
  ItemType,
  MediaListLicense,
} from "../MediaList";

interface ConceptLicenseInfoProps {
  concept: GQLConceptLicenseList_ConceptLicenseFragment | GQLGlossLicenseList_GlossLicenseFragment;
  type: "gloss" | "concept";
}

const LicenseAndButtonWrapper = styled.div`
  display: flex;
  align-items: start;
  gap: ${spacing.xsmall};
`;

const ConceptLicenseInfo = ({ concept, type }: ConceptLicenseInfoProps) => {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();

  const pageUrl = `/concept/${concept.id}`;

  const shouldShowLink = useMemo(() => pathname !== pageUrl, [pathname, pageUrl]);

  if (concept.copyright?.license?.license === undefined || concept.copyright.license.license === "") return null;

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
  if (concept.copyright.origin) {
    items.push({
      label: t("source"),
      description: concept.copyright.origin,
      metaType: metaTypes.other,
    });
  }
  if (concept.copyright.processed === true) {
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
    concept.copyright.license.license,
    "",
    (id: string) => t(id),
    i18n.language,
  );

  return (
    <MediaListItem>
      <LicenseAndButtonWrapper>
        <MediaListLicense
          licenseType={concept.copyright.license.license}
          title={t(`license.${type}.rules`)}
          sourceTitle={concept.title}
          sourceType={type}
        />
        {!isCopyrighted(concept.copyright.license.license) && (
          <AddResourceToFolderModal
            resource={{
              id: concept.id,
              path: `${config.ndlaFrontendDomain}/concept/${concept.id}`,
              resourceType: "concept",
            }}
          >
            <FavoriteButton path={`${config.ndlaFrontendDomain}/concept/${concept.id}`} />
          </AddResourceToFolderModal>
        )}
      </LicenseAndButtonWrapper>
      {!isCopyrighted(concept.copyright.license.license) && (
        <MediaListItemActions>
          {concept.src && (
            <SafeLinkButton to={downloadUrl(concept.src)} variant="outline">
              <Download />
              {t("license.download")}
            </SafeLinkButton>
          )}
          <CopyTextButton
            stringToCopy={`<iframe title="${concept.title}" aria-label="${concept.title}" height="400" width="500" frameborder="0" src="${src}" allowfullscreen=""></iframe>`}
            copyTitle={t("license.embed")}
            hasCopiedTitle={t("license.embedCopied")}
          />
          {shouldShowLink && (
            <SafeLinkButton to={pageUrl} target="_blank" rel="noopener noreferrer" variant="outline">
              <Launch />
              {t("license.openLink")}
            </SafeLinkButton>
          )}
        </MediaListItemActions>
      )}
      <MediaListItemBody license={concept.copyright.license.license} resourceUrl={concept.src} locale={i18n.language}>
        <MediaListItemActions>
          <MediaListRef>
            <MediaListItemMeta items={items} />
            {!isCopyrighted(concept.copyright.license.license) && !!copyText && (
              <CopyTextButton
                stringToCopy={copyText}
                copyTitle={t("license.copyTitle")}
                hasCopiedTitle={t("license.hasCopiedTitle")}
              >
                <Copy />
              </CopyTextButton>
            )}
          </MediaListRef>
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
