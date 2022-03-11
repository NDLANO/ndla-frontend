/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from '@apollo/client';
import styled from '@emotion/styled';
import { colors, fonts, spacing } from '@ndla/core';
import { Link } from 'react-router-dom';
import { GQLPodcastSeriesSummaryFragment } from '../../graphqlTypes';

const StyledCoverPhoto = styled.img`
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
`;

const FlexWrapper = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  margin: ${spacing.medium};
`;

const ImageWrapper = styled.div`
  width: 125px;
  padding: ${spacing.small};
  margin-right: ${spacing.medium};
  border: 1px solid ${colors.brand.greyLight};
`;

const StyledHeader = styled.h3`
  display: inline-block;
  font-size: 1rem;
  line-height: 1.3;
  color: ${colors.brand.primary};
  font-weight: 700;
  margin: 0px 0px ${spacing.xsmall};
`;

const StyledDescription = styled.p`
  ${fonts.sizes(16)};
  margin: 0;
  max-width: 600px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PodcastSeries = ({
  coverPhoto,
  description,
  title,
  id,
}: GQLPodcastSeriesSummaryFragment) => {
  return (
    <FlexWrapper>
      <ImageWrapper>
        <StyledCoverPhoto src={coverPhoto.url} alt={coverPhoto.altText} />
      </ImageWrapper>
      <div>
        <div>
          <Link to={`/podkast/${id}`}>
            <StyledHeader>{title.title}</StyledHeader>
          </Link>
        </div>
        <StyledDescription>{description.description}</StyledDescription>
      </div>
    </FlexWrapper>
  );
};

PodcastSeries.fragments = {
  series: gql`
    fragment PodcastSeriesSummary on PodcastSeriesSummary {
      id
      title {
        title
      }
      description {
        description
      }
      coverPhoto {
        url
        altText
      }
    }
  `,
};

export default PodcastSeries;
