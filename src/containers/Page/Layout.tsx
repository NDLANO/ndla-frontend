import { Content, PageContainer } from '@ndla/ui';
import ZendeskButton from '@ndla/zendesk';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { matchPath, Outlet, useLocation } from 'react-router-dom';
import Masthead from '../Masthead';
import config from '../../config';
import FeideFooter from './components/FeideFooter';
import Footer from './components/Footer';
import { useIsNdlaFilm } from '../../routeHelpers';

const Layout = () => {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();
  const zendeskLanguage =
    i18n.language === 'nb' || i18n.language === 'nn' ? 'no' : i18n.language;
  const ndlaFilm = useIsNdlaFilm();
  const showMasthead = pathname !== '/';
  const backgroundWide = !!matchPath(
    '/learningpaths/:learningpathId',
    pathname,
  );

  return (
    <PageContainer backgroundWide={backgroundWide} ndlaFilm={ndlaFilm}>
      <Helmet
        htmlAttributes={{ lang: i18n.language }}
        title="NDLA"
        meta={[{ name: 'description', content: t('meta.description') }]}
      />
      <Helmet>
        <meta property="fb:app_id" content="115263542481787" />
      </Helmet>
      {showMasthead && <Masthead />}
      <Content>
        <Outlet />
      </Content>
      <Footer />
      {config.feideEnabled && <FeideFooter />}
      {config.zendeskWidgetKey && (
        <ZendeskButton
          locale={zendeskLanguage}
          widgetKey={config.zendeskWidgetKey}>
          {t('askNDLA')}
        </ZendeskButton>
      )}
    </PageContainer>
  );
};
export default Layout;
