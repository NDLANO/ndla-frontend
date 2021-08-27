/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// @ts-ignore
import { OneColumn, ErrorMessage } from '@ndla/ui';
import React from 'react';
import { useTranslation } from 'react-i18next';

const DefaultErrorMessage = () => {
  const { t } = useTranslation();
  const illustrations = {
    url: '/static/oops.gif',
    altText: t('errorMessage.title'),
  };
  const messages = {
    title: t('errorMessage.title'),
    description: t('errorMessage.description'),
    linksTitle: t('errorMessage.linksTitle'),
    back: t('errorMessage.back'),
    goToFrontPage: t('errorMessage.goToFrontPage'),
  };

  return (
    <>
      <OneColumn cssModifier="clear">
        <ErrorMessage illustration={illustrations} messages={messages} />
      </OneColumn>
    </>
  );
};

export default DefaultErrorMessage;
