/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { Content, Masthead, Logo, PageContainer } from '@ndla/ui';
import ZendeskButton from '@ndla/zendesk';
import DefaultErrorMessage from '../../components/DefaultErrorMessage';
import config from '../../config';
import FeideFooter from '../Page/components/FeideFooter';
import Footer from '../Page/components/Footer';

const ZendeskWrapper = styled.div`
  z-index: 10;
`;

const LogoWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
`;

const ErrorPage = () => {
  const { t, i18n } = useTranslation();
  const zendeskLanguage =
    i18n.language === 'nb' || i18n.language === 'nn' ? 'no' : i18n.language;
  return (
    <PageContainer backgroundWide={true} ndlaFilm={false}>
      <Helmet
        htmlAttributes={{ lang: i18n.language }}
        title="NDLA"
        meta={[{ name: 'description', content: t('meta.description') }]}
      />
      <Masthead fixed>
        <LogoWrapper>
          <Logo to="/" locale={i18n.language} label={t('logo.altText')} />
        </LogoWrapper>
      </Masthead>
      <Content>
        <DefaultErrorMessage />
      </Content>
      <Footer />
      {config.feideEnabled && <FeideFooter />}
      {config.zendeskWidgetKey && (
        <ZendeskWrapper>
          <ZendeskButton
            locale={zendeskLanguage}
            widgetKey={config.zendeskWidgetKey}
          >
            {t('askNDLA')}
          </ZendeskButton>
        </ZendeskWrapper>
      )}
    </PageContainer>
  );
};

export default ErrorPage;
