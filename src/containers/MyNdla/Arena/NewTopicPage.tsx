/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { HelmetWithTracker, useTracker } from '@ndla/tracker';
import { Heading } from '@ndla/typography';
import ArenaForm, {
  ArenaFormValues,
  ArenaFormWrapper,
} from './components/ArenaForm';
import { toArena, toArenaCategory, toArenaTopic } from './utils';
import { AuthContext } from '../../../components/AuthenticationContext';
import { getAllDimensions } from '../../../util/trackingUtil';
import { useCreateArenaTopic } from '../arenaMutations';
import { arenaCategoryQuery, useArenaCategory } from '../arenaQueries';
import MyNdlaBreadcrumb from '../components/MyNdlaBreadcrumb';
import MyNdlaPageWrapper from '../components/MyNdlaPageWrapper';

const BreadcrumbWrapper = styled.div`
  padding-top: ${spacing.normal};
`;

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.large};
`;

export const NewTopicPage = () => {
  const { t } = useTranslation();
  const { categoryId } = useParams();
  const { trackPageView } = useTracker();
  const navigate = useNavigate();

  const arenaTopicMutation = useCreateArenaTopic({
    refetchQueries: [
      {
        query: arenaCategoryQuery,
        variables: { categoryId: categoryId, page: 1 },
      },
    ],
  });

  const { loading, arenaCategory } = useArenaCategory({
    variables: { categoryId: Number(categoryId), page: 1 },
    skip: !Number(categoryId),
  });
  const { user, authContextLoaded } = useContext(AuthContext);

  useEffect(() => {
    if (!authContextLoaded || !user?.arenaEnabled || !loading) return;
    trackPageView({
      title: t('htmlTitles.arenaNewTopicPage'),
      dimensions: getAllDimensions({ user }),
    });
  }, [arenaCategory?.name, authContextLoaded, loading, t, trackPageView, user]);

  const onSave = useCallback(
    async (values: Partial<ArenaFormValues>) => {
      const topic = await arenaTopicMutation.createArenaTopic({
        variables: {
          content: values.content ?? '',
          title: values.title ?? '',
          categoryId: Number(categoryId),
        },
      });
      if (topic.data?.newArenaTopic.id) {
        navigate(toArenaTopic(topic.data?.newArenaTopic?.id));
      }
    },
    [arenaTopicMutation, categoryId, navigate],
  );

  const onAbort = useCallback(() => {
    navigate(categoryId ? toArenaCategory(categoryId) : toArena());
  }, [categoryId, navigate]);

  return (
    <MyNdlaPageWrapper>
      <PageWrapper>
        <BreadcrumbWrapper>
          <MyNdlaBreadcrumb
            breadcrumbs={
              categoryId
                ? [
                    {
                      name: arenaCategory?.name ?? '',
                      id: `category/${categoryId}`,
                    },
                    { name: t('myNdla.arena.new.topic'), id: 'newTopic' },
                  ]
                : []
            }
            page={'arena'}
          />
        </BreadcrumbWrapper>
        <HelmetWithTracker title={t('htmlTitles.arenaNewTopicPage')} />
        <ArenaFormWrapper>
          <Heading element="h1" headingStyle="h1-resource" margin="none">
            {t('myNdla.arena.new.topic')}
          </Heading>
          <ArenaForm onAbort={onAbort} type="topic" onSave={onSave} />
        </ArenaFormWrapper>
      </PageWrapper>
    </MyNdlaPageWrapper>
  );
};
