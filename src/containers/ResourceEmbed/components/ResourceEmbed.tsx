/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TFunction } from "i18next";
import { useContext, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { gql } from "@apollo/client";
import styled from "@emotion/styled";
import { AccordionContent, AccordionHeader, AccordionItem, AccordionRoot } from "@ndla/accordion";
import { DynamicComponents, transform } from "@ndla/article-converter";
import { colors, spacing } from "@ndla/core";
import { Spinner } from "@ndla/icons";
import { HelmetWithTracker, useTracker } from "@ndla/tracker";
import { Text } from "@ndla/typography";
import { CreatedBy } from "@ndla/ui";
import ResourceEmbedLicenseBox from "./ResourceEmbedLicenseBox";
import ResourceEmbedWrapper from "./ResourceEmbedWrapper";
import { AuthContext } from "../../../components/AuthenticationContext";
import AddEmbedToFolder from "../../../components/MyNdla/AddEmbedToFolder";
import SocialMediaMetadata from "../../../components/SocialMediaMetadata";
import config from "../../../config";
import {
  GQLFolder,
  GQLResourceEmbedLicenseBox_MetaFragment,
  GQLResourceEmbedQuery,
  GQLResourceEmbedQueryVariables,
} from "../../../graphqlTypes";
import { useGraphQuery } from "../../../util/runQueries";
import { getAllDimensions } from "../../../util/trackingUtil";
import ErrorPage from "../../ErrorPage";
import NotFound from "../../NotFoundPage/NotFoundPage";

export type StandaloneEmbed = "image" | "audio" | "video" | "h5p" | "concept";

const CreatedByWrapper = styled.div`
  margin-top: ${spacing.small};
`;

const StyledAccordionHeader = styled(AccordionHeader)`
  background-color: ${colors.brand.lightest};
`;

interface Props {
  id: string;
  isOembed?: boolean;
  type: StandaloneEmbed;
  folder?: GQLFolder | null;
  noBackground?: boolean;
}

interface MetaProperies {
  title: string;
  audioUrl?: string;
  description?: string;
  imageUrl?: string;
  type: StandaloneEmbed | "gloss" | "podcast";
}

const converterComponents: DynamicComponents = {
  heartButton: AddEmbedToFolder,
};

const metaToProperties = (
  meta: GQLResourceEmbedLicenseBox_MetaFragment | undefined,
  type: StandaloneEmbed,
): MetaProperies | undefined => {
  if (!meta) {
    return undefined;
  }
  if (type === "audio") {
    const audio = meta?.audios?.[0] ?? meta?.podcasts?.[0];
    if (!audio) return undefined;
    return {
      title: audio.title,
      audioUrl: audio.src,
      description: audio.__typename === "PodcastLicense" ? audio.description : undefined,
      imageUrl: audio.__typename === "PodcastLicense" ? audio.coverPhotoUrl : undefined,
      type: audio.__typename === "PodcastLicense" ? "podcast" : "audio",
    };
  } else if (type === "image") {
    const image = meta.images?.[0];
    if (!image) return undefined;
    return {
      title: image.title,
      imageUrl: image.src,
      description: image.altText,
      type: "image",
    };
  } else if (type === "video") {
    const video = meta.brightcoves?.[0];
    return {
      title: video?.title ?? "",
      imageUrl: video?.cover,
      description: video?.description,
      type: "video",
    };
  } else if (type === "concept") {
    const concept = meta.concepts?.[0] ?? meta.glosses?.[0];
    if (!concept) return undefined;
    return {
      title: concept.title,
      description: concept.content,
      imageUrl: concept.metaImageUrl,
      type: concept.__typename === "GlossLicense" ? "gloss" : "concept",
    };
  } else if (type === "h5p") {
    const h5p = meta.h5ps?.[0];
    if (!h5p) return undefined;
    return {
      title: h5p.title,
      type: "h5p",
    };
  } else {
    return undefined;
  }
};

export const hasLicensedContent = (meta: GQLResourceEmbedLicenseBox_MetaFragment) => {
  if (meta.h5ps?.some((value) => value.copyright)) {
    return true;
  } else if (meta.images?.some((val) => val.copyright)) {
    return true;
  } else if (meta.audios?.some((val) => val.copyright)) {
    return true;
  } else if (meta.concepts?.some((val) => val.copyright)) {
    return true;
  } else if (meta.glosses?.some((val) => val.copyright)) {
    return true;
  } else if (meta.brightcoves?.some((val) => val.copyright)) {
    return true;
  } else if (meta.podcasts?.some((val) => val.copyright)) {
    return true;
  }
  return false;
};

const ResourceEmbed = ({ id, type, noBackground, isOembed, folder }: Props) => {
  const { user, authContextLoaded } = useContext(AuthContext);
  const { trackPageView } = useTracker();
  const { t } = useTranslation();
  const { pathname } = useLocation();

  const { data, loading, error } = useGraphQuery<GQLResourceEmbedQuery, GQLResourceEmbedQueryVariables>(
    ResourceEmbedQuery,
    {
      variables: { id: id ?? "", type },
      skip: !id,
    },
  );

  const properties = useMemo(() => metaToProperties(data?.resourceEmbed.meta, type), [data?.resourceEmbed.meta, type]);

  const transformedContent = useMemo(() => {
    if (!data?.resourceEmbed.content) {
      return undefined;
    }
    return transform(data.resourceEmbed.content, {
      frontendDomain: "",
      components: isOembed ? undefined : converterComponents,
      path: pathname,
      renderContext: "embed",
    });
  }, [data?.resourceEmbed.content, isOembed, pathname]);

  useEffect(() => {
    if (!authContextLoaded || !properties) return;
    const dimensions = getAllDimensions({ user });
    const title = getDocumentTitle(folder?.name, properties.title, properties.type, t);
    trackPageView({ dimensions, title });
  }, [authContextLoaded, properties, t, trackPageView, user, folder]);

  if (loading) {
    return <Spinner />;
  }

  if (error?.graphQLErrors.some((e) => e?.extensions?.status === 404)) {
    return <NotFound />;
  }

  if (error || !transformedContent || !properties) {
    return <ErrorPage />;
  }
  const socialMediaTitle = `${properties.title} - ${t(`embed.type.${properties.type}`)}`;
  return (
    <>
      <HelmetWithTracker title={getDocumentTitle(folder?.name, properties.title, properties.type, t)} />
      <SocialMediaMetadata
        type="website"
        audioUrl={properties?.audioUrl}
        title={socialMediaTitle}
        description={properties?.description}
        imageUrl={properties?.imageUrl}
      >
        <meta name="robots" content="noindex, nofollow" />
      </SocialMediaMetadata>
      <main>
        <ResourceEmbedWrapper type={properties?.type} title={properties?.title} noBackground={noBackground}>
          {transformedContent}
          <AccordionRoot type="single" collapsible>
            {data?.resourceEmbed.meta && hasLicensedContent(data.resourceEmbed.meta) && (
              <AccordionItem value="rulesForUse">
                <StyledAccordionHeader headingLevel="h2">
                  <Text element="span" textStyle="button" margin="none">
                    {t("article.useContent")}
                  </Text>
                </StyledAccordionHeader>
                <AccordionContent>
                  <ResourceEmbedLicenseBox metaData={data.resourceEmbed.meta} />
                </AccordionContent>
              </AccordionItem>
            )}
          </AccordionRoot>
          {isOembed && (
            <CreatedByWrapper>
              <CreatedBy
                name={t("createdBy.content")}
                description={t("createdBy.text")}
                url={`${config.ndlaFrontendDomain}/${type}/${id}`}
              />
            </CreatedByWrapper>
          )}
        </ResourceEmbedWrapper>
      </main>
    </>
  );
};

const getDocumentTitle = (folderName: string | undefined, title: string, type: string | undefined, t: TFunction) => {
  const maybeFolder = folderName ? `${folderName} - ` : "";
  const maybeType = type ? ` - ${t(`embed.type.${type}`)}` : "";
  return t("htmlTitles.sharedFolderPage", {
    name: `${maybeFolder}${title}${maybeType}`,
  });
};

export const ResourceEmbedQuery = gql`
  query resourceEmbed($id: String!, $type: String!) {
    resourceEmbed(id: $id, type: $type) {
      content
      meta {
        ...ResourceEmbedLicenseBox_Meta
      }
    }
  }
  ${ResourceEmbedLicenseBox.fragments.metaData}
`;

export default ResourceEmbed;
