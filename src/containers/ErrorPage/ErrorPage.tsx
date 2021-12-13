/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
//@ts-ignore
import { Content, Masthead, MastheadItem, Logo } from '@ndla/ui';
import { RouteProps } from 'react-router';
import { useTranslation } from 'react-i18next';
import DefaultErrorMessage from '../../components/DefaultErrorMessage';
import Page from '../Page/Page';
import { LocationShape } from '../../shapes';
import { LocaleType } from '../../interfaces';

interface Props extends RouteProps {
  locale: LocaleType;
}

const ErrorPage = ({ locale, location }: Props) => {
  const { t } = useTranslation();
  return (
    <Page location={location}>
      <Content>
        <Masthead showLoaderWhenNeeded={false} fixed>
          <MastheadItem right>
            <Logo to="/" locale={locale} label={t('logo.altText')} />
          </MastheadItem>
        </Masthead>
        <DefaultErrorMessage />
      </Content>
    </Page>
  );
};

ErrorPage.propTypes = {
  locale: PropTypes.string.isRequired,
  location: LocationShape,
};

export default ErrorPage;
