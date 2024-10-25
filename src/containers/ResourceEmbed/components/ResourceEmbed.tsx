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
import { transform } from "@ndla/article-converter";
import { HeroBackground, HeroContent, PageContent, Spinner } from "@ndla/primitives";
import { HelmetWithTracker, useTracker } from "@ndla/tracker";
import { ArticleFooter, ArticleWrapper, ContentTypeHero, HomeBreadcrumb, ArticleContent, ArticleTitle } from "@ndla/ui";
import ResourceEmbedLicenseContent from "./ResourceEmbedLicenseContent";
import { CreatedBy } from "../../../components/Article/CreatedBy";
import { AuthContext } from "../../../components/AuthenticationContext";
import { DefaultErrorMessagePage } from "../../../components/DefaultErrorMessage";
import SocialMediaMetadata from "../../../components/SocialMediaMetadata";
import config from "../../../config";
import { SKIP_TO_CONTENT_ID } from "../../../constants";
import {
  GQLResourceEmbedLicenseContent_MetaFragment,
  GQLResourceEmbedQuery,
  GQLResourceEmbedQueryVariables,
} from "../../../graphqlTypes";
import { useGraphQuery } from "../../../util/runQueries";
import { getAllDimensions } from "../../../util/trackingUtil";
import { NotFoundPage } from "../../NotFoundPage/NotFoundPage";

export type StandaloneEmbed = "image" | "audio" | "video" | "h5p" | "concept";

interface Props {
  id: string;
  isOembed?: boolean;
  type: StandaloneEmbed;
}

interface MetaProperies {
  title: string;
  audioUrl?: string;
  description?: string;
  imageUrl?: string;
  type: StandaloneEmbed | "gloss" | "podcast";
}

const metaToProperties = (
  meta: GQLResourceEmbedLicenseContent_MetaFragment | undefined,
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

export const hasLicensedContent = (meta: GQLResourceEmbedLicenseContent_MetaFragment) => {
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

const ResourceEmbed = ({ id, type, isOembed }: Props) => {
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
      path: pathname,
      renderContext: "embed",
    });
  }, [data?.resourceEmbed.content, pathname]);

  useEffect(() => {
    if (!authContextLoaded || !properties) return;
    const dimensions = getAllDimensions({ user });
    const title = getDocumentTitle(properties.title, properties.type, t);
    trackPageView({ dimensions, title });
  }, [authContextLoaded, properties, t, trackPageView, user]);

  if (loading) {
    return <Spinner />;
  }

  if (error?.graphQLErrors.some((e) => e?.extensions?.status === 404)) {
    return <NotFoundPage />;
  }

  if (error || !transformedContent || !properties) {
    return <DefaultErrorMessagePage />;
  }
  const socialMediaTitle = `${properties.title} - ${t(`embed.type.${properties.type}`)}`;
  const path = `/${type}/${id}`;

  return (
    <>
      <HelmetWithTracker title={getDocumentTitle(properties.title, properties.type, t)} />
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
        <ContentTypeHero contentType={type}>
          {!isOembed && <HeroBackground />}
          <PageContent variant="article">
            {!isOembed && (
              <HeroContent>
                <HomeBreadcrumb
                  items={[
                    {
                      name: t("breadcrumb.toFrontpage"),
                      to: "/",
                    },
                    {
                      name: properties.title,
                      to: path,
                    },
                  ]}
                />
              </HeroContent>
            )}
          </PageContent>
          <PageContent variant="article" gutters="tabletUp">
            <PageContent variant="content" asChild>
              <ArticleWrapper>
                <ArticleTitle title={properties.title} id={SKIP_TO_CONTENT_ID} contentType={type} />
                <ArticleContent>
                  <section>{transformedContent}</section>
                </ArticleContent>
                <ArticleFooter>
                  {data?.resourceEmbed.meta && hasLicensedContent(data.resourceEmbed.meta) && (
                    <ResourceEmbedLicenseContent metaData={data.resourceEmbed.meta} />
                  )}
                  {isOembed && (
                    <CreatedBy
                      name={t("createdBy.content")}
                      description={t("createdBy.text")}
                      url={`${config.ndlaFrontendDomain}/${type}/${id}`}
                    />
                  )}
                </ArticleFooter>
              </ArticleWrapper>
            </PageContent>
          </PageContent>
        </ContentTypeHero>
      </main>
    </>
  );
};

const getDocumentTitle = (title: string, type: string | undefined, t: TFunction) => {
  const maybeType = type ? ` - ${t(`embed.type.${type}`)}` : "";
  return t("htmlTitles.sharedFolderPage", {
    name: `${title}${maybeType}`,
  });
};

export const ResourceEmbedQuery = gql`
  query resourceEmbed($id: String!, $type: String!) {
    resourceEmbed(id: $id, type: $type) {
      content
      meta {
        ...ResourceEmbedLicenseContent_Meta
      }
    }
  }
  ${ResourceEmbedLicenseContent.fragments.metaData}
`;

export default ResourceEmbed;
