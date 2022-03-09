/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { OneColumn, ErrorMessage } from '@ndla/ui';
import { HelmetWithTracker } from '@ndla/tracker';
import { useTranslation } from 'react-i18next';
import { Status } from '../../components';

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <Status code={404}>
      <HelmetWithTracker title={t('htmlTitles.notFound')} />
      <OneColumn cssModifier="clear">
        <ErrorMessage
          illustration={{
            url: '/static/not-exist.gif',
            altText: t('errorMessage.title'),
          }}
          messages={{
            title: t('notFoundPage.title'),
            description: t('notFoundPage.errorDescription'),
            back: t('errorMessage.back'),
            goToFrontPage: t('errorMessage.goToFrontPage'),
          }}
        />
      </OneColumn>
    </Status>
  );
};

NotFound.propTypes = {};

export default NotFound;
