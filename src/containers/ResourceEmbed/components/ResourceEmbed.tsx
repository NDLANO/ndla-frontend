/**
 * Copyright (C) 2023 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { gql } from '@apollo/client';
import styled from '@emotion/styled';
import { DynamicComponents, transform } from '@ndla/article-converter';
import { Spinner } from '@ndla/icons';
import { HelmetWithTracker } from '@ndla/tracker';
import {
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionRoot,
} from '@ndla/accordion';
import { CreatedBy } from '@ndla/ui';
import { colors, fonts, spacing } from '@ndla/core';
import ResourceEmbedLicenseBox from './ResourceEmbedLicenseBox';
import {
  GQLResourceEmbedLicenseBox_MetaFragment,
  GQLResourceEmbedQuery,
  GQLResourceEmbedQueryVariables,
} from '../../../graphqlTypes';
import ErrorPage from '../../ErrorPage';
import SocialMediaMetadata from '../../../components/SocialMediaMetadata';
import ResourceEmbedWrapper from './ResourceEmbedWrapper';
import NotFound from '../../NotFoundPage/NotFoundPage';
import { useGraphQuery } from '../../../util/runQueries';
import AddEmbedToFolder from '../../../components/MyNdla/AddEmbedToFolder';
import config from '../../../config';

export type StandaloneEmbed = 'image' | 'audio' | 'video' | 'h5p' | 'concept';

const CreatedByWrapper = styled.div`
  margin-top: ${spacing.small};
`;

const StyledAccordionHeader = styled(AccordionHeader)`
  background-color: ${colors.brand.lightest};
  border: 1px solid ${colors.brand.tertiary};
  font-size: ${fonts.sizes('16px', '29px')};
  font-weight: ${fonts.weight.semibold};
`;

interface Props {
  id: string;
  isOembed?: boolean;
  type: StandaloneEmbed;
  noBackground?: boolean;
}

interface MetaProperies {
  title: string;
  audioUrl?: string;
  description?: string;
  imageUrl?: string;
  type: StandaloneEmbed | 'podcast';
}

const converterComponents: DynamicComponents | undefined =
  config.favoriteEmbedEnabled ? { heartButton: AddEmbedToFolder } : undefined;

const metaToProperties = (
  meta: GQLResourceEmbedLicenseBox_MetaFragment | undefined,
  type: StandaloneEmbed,
): MetaProperies | undefined => {
  if (!meta) {
    return undefined;
  }
  if (type === 'audio') {
    const audio = meta?.audios?.[0] ?? meta?.podcasts?.[0];
    if (!audio) return undefined;
    return {
      title: audio.title,
      audioUrl: audio.src,
      description:
        audio.__typename === 'PodcastLicense' ? audio.description : undefined,
      imageUrl:
        audio.__typename === 'PodcastLicense' ? audio.coverPhotoUrl : undefined,
      type: audio.__typename === 'PodcastLicense' ? 'podcast' : 'audio',
    };
  } else if (type === 'image') {
    const image = meta.images?.[0];
    if (!image) return undefined;
    return {
      title: image.title,
      imageUrl: image.src,
      description: image.altText,
      type: 'image',
    };
  } else if (type === 'video') {
    const video = meta.brightcoves?.[0];
    return {
      title: video?.title ?? '',
      imageUrl: video?.cover,
      description: video?.description,
      type: 'video',
    };
  } else if (type === 'concept') {
    const concept = meta.concepts?.[0];
    if (!concept) return undefined;
    return {
      title: concept.title,
      description: concept.content,
      imageUrl: concept.metaImageUrl,
      type: 'concept',
    };
  } else if (type === 'h5p') {
    return undefined;
  } else {
    return undefined;
  }
};

const ResourceEmbed = ({ id, type, noBackground, isOembed }: Props) => {
  const { t } = useTranslation();

  const { data, loading, error } = useGraphQuery<
    GQLResourceEmbedQuery,
    GQLResourceEmbedQueryVariables
  >(ResourceEmbedQuery, {
    variables: { id: id ?? '', type },
    skip: !id,
  });

  const properties = useMemo(
    () => metaToProperties(data?.resourceEmbed.meta, type),
    [data?.resourceEmbed.meta, type],
  );

  const transformedContent = useMemo(() => {
    if (!data?.resourceEmbed.content) {
      return undefined;
    }
    return transform(data.resourceEmbed.content, {
      frontendDomain: '',
      components: isOembed ? undefined : converterComponents,
    });
  }, [data?.resourceEmbed.content, isOembed]);

  if (loading) {
    return <Spinner />;
  }

  if (error?.graphQLErrors.some((e) => e?.extensions?.status === 404)) {
    return <NotFound />;
  }

  if (error || !transformedContent || !properties) {
    return <ErrorPage />;
  }
  const socialMediaTitle = `${properties.title} - ${t(
    `embed.type.${properties.type}`,
  )}`;
  return (
    <>
      <HelmetWithTracker title={`${socialMediaTitle} - NDLA`} />
      <SocialMediaMetadata
        type="website"
        audioUrl={properties?.audioUrl}
        title={socialMediaTitle}
        description={properties?.description}
        imageUrl={properties?.imageUrl}
      >
        <meta name="robots" content="noindex" />
      </SocialMediaMetadata>
      <main>
        <ResourceEmbedWrapper
          type={type}
          title={properties?.title}
          noBackground={noBackground}
        >
          {transformedContent}
          <AccordionRoot type="single" collapsible>
            {data?.resourceEmbed.meta && (
              <AccordionItem value="rulesForUse">
                <StyledAccordionHeader>
                  {t('article.useContent')}
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
                name={t('createdBy.content')}
                description={t('createdBy.text')}
                url={`${config.ndlaFrontendDomain}/${type}/${id}`}
              />
            </CreatedByWrapper>
          )}
        </ResourceEmbedWrapper>
      </main>
    </>
  );
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
