/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { Navigate, useParams } from 'react-router-dom';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { Spinner } from '@ndla/icons';
import SafeLink from '@ndla/safelink';
import { HelmetWithTracker } from '@ndla/tracker';
import { Heading, Text } from '@ndla/typography';
import Flags from './FlagCard';
import FlaggedPostCard from './FlaggedPostCard';
import { SKIP_TO_CONTENT_ID } from '../../../../constants';
import { useArenaPostInContext } from '../../arenaQueries';
import MyNdlaPageWrapper from '../../components/MyNdlaPageWrapper';
import { toArenaTopic } from '../utils';

const StyledCardContainer = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xsmall};
  padding: ${spacing.normal} 0;
`;

const ArenaSingleFlagPage = () => {
  const { postId } = useParams();
  const { t } = useTranslation();
  const { topic, loading } = useArenaPostInContext({
    variables: {
      postId: Number(postId),
      pageSize: 1,
    },
  });

  if (loading) return <Spinner />;

  const flaggedPost = topic?.posts?.items[0];

  if (!postId || !topic || !flaggedPost)
    return <Navigate to={'/404'} replace />;

  return (
    <MyNdlaPageWrapper>
      <HelmetWithTracker title={t('htmlTitles.arenaAdminPage')} />
      <Heading
        element="h1"
        id={SKIP_TO_CONTENT_ID}
        headingStyle="h1-resource"
        margin="small"
      >
        {t('myNdla.arena.admin.flags.singleFlagTitle', { postId })}
      </Heading>
      <Text element="p" textStyle="content-alt">
        {t('myNdla.arena.admin.flags.singleFlagDescription')}
      </Text>
      <StyledCardContainer>
        <Heading element="h2" headingStyle="h2" margin="small">
          {t('myNdla.arena.admin.flags.flaggedPost')}
        </Heading>
        <Text element="p" margin="small">
          {t('myNdla.arena.admin.flags.inThread')}{' '}
          <SafeLink to={toArenaTopic(topic.id)}>{`"${topic.title}"`}</SafeLink>
        </Text>
        <FlaggedPostCard post={flaggedPost} topic={topic} />
        <Heading element="h2" headingStyle="h2" margin="small">
          {t('myNdla.arena.admin.flags.postFlags')}
        </Heading>
        {flaggedPost.flags?.map((flag) => {
          return <Flags key={flag.id} flag={flag} />;
        })}
      </StyledCardContainer>
    </MyNdlaPageWrapper>
  );
};

export default ArenaSingleFlagPage;
