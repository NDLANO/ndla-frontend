/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { OneColumn, ContentPlaceholder, ConceptNotion } from '@ndla/ui';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { figureApa7CopyString } from '@ndla/licenses';
import { gql } from '@apollo/client';
import { HelmetWithTracker } from '@ndla/tracker';
import { GQLConceptQuery } from '../../graphqlTypes';
import { conceptSearchInfoFragment } from '../../queries';
import { useGraphQuery } from '../../util/runQueries';
import SocialMediaMetadata from '../../components/SocialMediaMetadata';
import DefaultErrorMessage from '../../components/DefaultErrorMessage';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import config from '../../config';
import ImageActionButtons from './components/ImageActionsButtons';
import { useTypedParams } from '../../routeHelpers';

const ConceptPage = () => {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const { conceptId } = useTypedParams();
  const { data, loading, error } = useGraphQuery<GQLConceptQuery>(
    conceptQuery,
    {
      variables: {
        id: Number(conceptId),
      },
      skip: isNaN(Number(conceptId)),
    },
  );

  const copyString = figureApa7CopyString(
    data?.concept?.visualElement?.title,
    undefined,
    data?.concept?.visualElement?.url,
    undefined,
    data?.concept?.copyright,
    data?.concept?.copyright?.license?.license,
    config.ndlaFrontendDomain,
    t,
    language,
  );
  const concept = data?.concept;

  const visualElement = useMemo(() => {
    const visualElement = {
      copyright: data?.concept?.visualElement?.copyright,
      title: data?.concept?.visualElement?.title ?? data?.concept?.title,
    };

    switch (data?.concept?.visualElement?.resource) {
      case 'image': {
        return {
          ...visualElement,
          url:
            data?.concept?.image?.url ??
            data?.concept?.visualElement?.image?.src,
          image: {
            src:
              data?.concept?.image?.url ??
              data?.concept?.visualElement?.image?.src ??
              '',
            alt:
              data?.concept?.visualElement?.image?.alt ??
              data?.concept?.image?.alt ??
              '',
          },
          licenseButtons: (
            <ImageActionButtons
              copyString={copyString}
              src={data?.concept?.visualElement?.image?.src ?? ''}
              license={
                data?.concept?.visualElement?.copyright?.license.license ?? ''
              }
            />
          ),
          resource: data?.concept?.visualElement?.resource,
        };
      }
      case 'external':
      case 'iframe':
        return {
          ...visualElement,
          url: data?.concept?.visualElement?.url ?? '',
          resource: data?.concept?.visualElement?.resource,
        };
      case 'brightcove': {
        return {
          ...visualElement,
          url:
            data?.concept?.visualElement?.brightcove?.src ??
            data.concept.visualElement.url,
          resource: data?.concept?.visualElement?.resource,
        };
      }
      case 'video':
      case 'h5p':
        return {
          ...visualElement,
          url: data?.concept?.visualElement?.h5p?.src,
          resource: data?.concept?.visualElement?.resource,
        };
      default:
        return;
    }
  }, [data?.concept, copyString]);

  if (loading) {
    return <ContentPlaceholder />;
  }

  if (error) {
    return <DefaultErrorMessage />;
  }

  if (!data || !concept || !visualElement) {
    return <NotFoundPage />;
  }

  const image = concept.image && {
    src: concept.image.url,
    alt: concept.image.alt,
  };

  const title = `${concept?.title} - ${t('resourcepageTitles.concept')}`;

  return (
    <OneColumn>
      <HelmetWithTracker title={`${title} - NDLA`} />
      <SocialMediaMetadata
        type="website"
        trackableContent={concept}
        title={title}
        description={concept.content}
        imageUrl={image?.src}
      >
        <meta name="robots" content="noindex" />
      </SocialMediaMetadata>
      <h1>{`${t('resourcepageTitles.concept')}`}</h1>
      <ConceptNotion
        concept={{
          ...concept,
          text: concept?.content || '',
          title: concept?.title || '',
          visualElement,
          image,
        }}
        type={
          visualElement?.resource === 'brightcove'
            ? 'video'
            : visualElement?.resource
        }
      />
    </OneColumn>
  );
};

export const conceptQuery = gql`
  query concept($id: Int!) {
    concept(id: $id) {
      ...ConceptSearchConcept
      content
      source
      articles {
        title
        id
      }
      copyright {
        license {
          url
          description
        }
      }
    }
  }
  ${conceptSearchInfoFragment}
`;

export default ConceptPage;
