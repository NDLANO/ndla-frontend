/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { HelmetWithTracker } from '@ndla/tracker';
import { OneColumn, ErrorMessage } from '@ndla/ui';
import { useTranslation } from 'react-i18next';

import { SubjectLinkList } from '../../components';
import { useGraphQuery } from '../../util/runQueries';
import { subjectsQuery } from '../../queries';
import { GQLSubjectsQuery } from '../../graphqlTypes';

const AllSubjectsPage = () => {
  const { t } = useTranslation();
  const { error, loading, data } = useGraphQuery<GQLSubjectsQuery>(
    subjectsQuery,
  );
  if (loading) return null;
  return (
    <div className="c-resources u-padding-top-large">
      <HelmetWithTracker title={t('htmlTitles.subjectsPage')} />
      <OneColumn>
        {error && !data ? (
          <ErrorMessage
            illustration={{
              url: '/static/oops.gif',
              altText: t('errorMessage.title'),
            }}
            messages={{
              title: t('errorMessage.title'),
              description: t('subjectsPage.errorDescription'),
              back: t('errorMessage.back'),
              goToFrontPage: t('errorMessage.goToFrontPage'),
            }}
          />
        ) : (
          <section>
            <h2>{t('subjectsPage.chooseSubject')}</h2>
            <SubjectLinkList subjects={data && data.subjects} />{' '}
          </section>
        )}
      </OneColumn>
    </div>
  );
};

export default AllSubjectsPage;
