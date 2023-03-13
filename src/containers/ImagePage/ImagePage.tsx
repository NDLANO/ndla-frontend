/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { OneColumn, ContentPlaceholder } from '@ndla/ui';
import { useParams } from 'react-router-dom';
import { gql } from '@apollo/client';
import { HelmetWithTracker } from '@ndla/tracker';
import { useTranslation } from 'react-i18next';
import { GQLImageQuery, GQLImageQueryVariables } from '../../graphqlTypes';
import { useGraphQuery } from '../../util/runQueries';
import SocialMediaMetadata from '../../components/SocialMediaMetadata';
import DefaultErrorMessage from '../../components/DefaultErrorMessage';
import NotFoundPage from '../../containers/NotFoundPage/NotFoundPage';
import { copyrightInfoFragment } from '../../queries';
import ImageElement from './components/ImageElement';

const ImagePage = () => {
  const { imageId } = useParams();
  const { t } = useTranslation();

  const { data, loading, error } = useGraphQuery<
    GQLImageQuery,
    GQLImageQueryVariables
  >(imageQuery, {
    variables: { id: imageId ?? '' },
    skip: Number.isNaN(imageId),
  });

  if (loading) {
    return <ContentPlaceholder />;
  }

  if (error) {
    return <DefaultErrorMessage />;
  }

  if (!data?.image) {
    return <NotFoundPage />;
  }

  const title = `${data?.image?.title.title} - ${t(
    'resourcepageTitles.image',
  )}`;

  return (
    <OneColumn>
      <HelmetWithTracker title={`${title} - NDLA`} />
      <SocialMediaMetadata
        type="website"
        title={title}
        description={data?.image?.alttext?.alttext}
        imageUrl={data?.image?.imageUrl}>
        <meta name="robots" content="noindex" />
      </SocialMediaMetadata>
      <ImageElement image={data.image} />
    </OneColumn>
  );
};

const imageQuery = gql`
  ${copyrightInfoFragment}
  ${ImageElement.fragments.image}
  query image($id: String!) {
    image(id: $id) {
      ...ImageElement
    }
  }
`;

export default ImagePage;
