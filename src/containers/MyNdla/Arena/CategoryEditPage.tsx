/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { Spinner } from '@ndla/icons';
import { HelmetWithTracker, useTracker } from '@ndla/tracker';
import { INewCategory } from '@ndla/types-backend/myndla-api';
import { Heading } from '@ndla/typography';
import ArenaCategoryForm from './components/ArenaCategoryForm';
import { ArenaFormWrapper } from './components/ArenaForm';
import { useArenaCategory } from './components/temporaryNodebbHooks';
import { toArena, toArenaCategory } from './utils';
import { AuthContext } from '../../../components/AuthenticationContext';
import { getAllDimensions } from '../../../util/trackingUtil';
import { useEditArenaCategory } from '../arenaMutations';
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

const CategoryEditPage = () => {
  const { t } = useTranslation();
  const { trackPageView } = useTracker();
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { loading, arenaCategory } = useArenaCategory(categoryId);
  const updateCategory = useEditArenaCategory();
  const { user, authContextLoaded } = useContext(AuthContext);

  useEffect(() => {
    if (!authContextLoaded || !user?.arenaEnabled || !user?.isModerator) return;
    trackPageView({
      title: t('htmlTitles.arenaNewCategoryPage'),
      dimensions: getAllDimensions({ user }),
    });
  }, [authContextLoaded, t, trackPageView, user]);

  const onSave = useCallback(
    async (values: Partial<INewCategory>) => {
      const category = await updateCategory.editArenaCategory({
        variables: {
          categoryId: Number(categoryId),
          description: values.description ?? '',
          title: values.title ?? '',
          visible: values.visible ?? true,
        },
      });

      if (category.data?.updateArenaCategory.id) {
        navigate(toArenaCategory(category.data?.updateArenaCategory.id));
      }
    },
    [updateCategory, categoryId, navigate],
  );

  const onAbort = useCallback(() => {
    if (categoryId) navigate(toArenaCategory(categoryId));
    else navigate(toArena());
  }, [categoryId, navigate]);

  if (loading || !authContextLoaded) return <Spinner />;
  if (!categoryId) return <Navigate to={toArena()} />;
  if (!user?.isModerator) return <Navigate to={toArenaCategory(categoryId)} />;

  return (
    <MyNdlaPageWrapper>
      <PageWrapper>
        <BreadcrumbWrapper>
          <MyNdlaBreadcrumb
            breadcrumbs={[
              {
                name: arenaCategory?.title ?? '',
                id: `category/${categoryId}`,
              },
              {
                name: t('myNdla.arena.admin.category.form.editCategory'),
                id: 'editCategory',
              },
            ]}
            page={'arena'}
          />
        </BreadcrumbWrapper>
        <HelmetWithTracker title={t('htmlTitles.arenaEditCategoryPage')} />
        <ArenaFormWrapper>
          <Heading element="h1" headingStyle="h1-resource" margin="none">
            {t('myNdla.arena.admin.category.form.editCategory')}
          </Heading>
          <ArenaCategoryForm
            onAbort={onAbort}
            onSave={onSave}
            initialTitle={arenaCategory?.title}
            initialDescription={arenaCategory?.description}
            initialVisible={arenaCategory?.visible}
          />
        </ArenaFormWrapper>
      </PageWrapper>
    </MyNdlaPageWrapper>
  );
};

export default CategoryEditPage;
