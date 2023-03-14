/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { OneColumn, ContentPlaceholder } from '@ndla/ui';
import styled from '@emotion/styled';
import { breakpoints, fonts, mq, spacing } from '@ndla/core';
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

export const StyledResourceHeader = styled.h1`
  margin: ${spacing.medium} ${spacing.normal} ${spacing.normal} 0;
  ${fonts.sizes('24px', '28px')}
  ${mq.range({ from: breakpoints.tablet })} {
    margin: 40px ${spacing.normal} 18px 0;
    ${fonts.sizes('32px', '28px')};
  }
  ${mq.range({ from: breakpoints.desktop })} {
    margin: 60px ${spacing.normal} 24px 0;
    ${fonts.sizes('52px', '65px')};
  }
`;

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
      <StyledResourceHeader id="SkipToContentId" tabIndex={-1}>
        {title}
      </StyledResourceHeader>
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
