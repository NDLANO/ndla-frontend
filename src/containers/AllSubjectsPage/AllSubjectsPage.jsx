/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { HelmetWithTracker } from '@ndla/tracker';
import { OneColumn, ErrorMessage } from '@ndla/ui';
import { injectT } from '@ndla/i18n';

import { SubjectLinkList } from '../../components';
import { SubjectShape } from '../../shapes';
import { useGraphQuery } from '../../util/runQueries';
import { subjectsQuery } from '../../queries';

const AllSubjectsPage = ({ t }) => {
  const { error, loading, data } = useGraphQuery({ query: subjectsQuery });
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

AllSubjectsPage.propTypes = {
  subjects: PropTypes.arrayOf(SubjectShape).isRequired,
  hasFailed: PropTypes.bool.isRequired,
};

export default injectT(AllSubjectsPage);
