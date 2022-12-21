import { OneColumn, ContentPlaceholder, ConceptNotion } from '@ndla/ui';
import { useEffect, useMemo } from 'react';
import { initArticleScripts } from '@ndla/article-scripts';
import { useLocation } from 'react-router-dom';
import { GQLConcept, GQLConceptQuery } from '../../graphqlTypes';
import { conceptQuery } from '../../queries';
import { useGraphQuery } from '../../util/runQueries';
import DefaultErrorMessage from '../../components/DefaultErrorMessage';
import NotFoundPage from '../NotFoundPage/NotFoundPage';

const getResourceId = (path: string) => path.split('/').pop(); // TODO validation?

const ConceptPage = () => {
  const location = useLocation();
  const { data, loading: isLoadingConcept, error } = useGraphQuery<
    GQLConceptQuery
  >(conceptQuery, {
    variables: {
      id: Number.parseInt(getResourceId(location.pathname)?.toString()!),
    },
    skip: !getResourceId(location.pathname)?.match('^[0-9]*$'),
  });

  useEffect(() => {
    initArticleScripts();
  }, [isLoadingConcept]);

  const concept = data?.concept as GQLConcept;

  const visualElement = useMemo(() => {
    const embed = concept?.visualElement;
    if (!embed) return;
    switch (embed?.resource) {
      case 'image': {
        return {
          resource: embed.resource,
          url: embed.image?.src ?? '',
          image: {
            src: embed.image?.src ?? '',
            alt: embed.image?.alt ?? '',
          },
        };
      }
      case 'external':
      case 'iframe':
        return {
          resource: embed.resource,
          url: embed.url ?? '',
          title: embed.title,
        };
      case 'brightcove': {
        return {
          resource: embed.resource,
          url: embed.brightcove?.src,
          title: embed.title,
        };
      }
      case 'video':
      case 'h5p':
        return {
          resource: embed.resource,
          url: embed.h5p?.src,
          title: embed.title,
        };
      default:
        return;
    }
  }, [concept?.visualElement]);

  const image = concept?.image && {
    src: concept.image?.src,
    alt: concept.image?.altText,
  };

  if (isLoadingConcept) {
    return <ContentPlaceholder />;
  }

  if (error) {
    return <DefaultErrorMessage />;
  }

  if (!data?.concept || !data || !visualElement) {
    return <NotFoundPage />;
  }

  return (
    <OneColumn>
      <ConceptNotion
        concept={{
          ...concept,
          text: concept.content || '',
          title: concept.title,
          visualElement,
          image,
        }}
        hideIconsAndAuthors
        type={
          visualElement?.resource === 'brightcove'
            ? 'video'
            : visualElement?.resource
        }
        disableScripts={true}
      />
    </OneColumn>
  );
};

export default ConceptPage;
