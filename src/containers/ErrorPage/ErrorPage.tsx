/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Content, Masthead, MastheadItem, Logo } from '@ndla/ui';
import { useTranslation } from 'react-i18next';
import DefaultErrorMessage from '../../components/DefaultErrorMessage';
import Page from '../Page/Page';

const ErrorPage = () => {
  const { t, i18n } = useTranslation();
  return (
    <Page>
      <Masthead fixed>
        <MastheadItem right>
          <Logo to="/" locale={i18n.language} label={t('logo.altText')} />
        </MastheadItem>
      </Masthead>
      <Content>
        <DefaultErrorMessage />
      </Content>
    </Page>
  );
};

export default ErrorPage;
