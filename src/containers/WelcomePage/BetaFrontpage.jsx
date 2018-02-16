import React from 'react';
import { bool } from 'prop-types';
import {
  LayoutItem,
  ArticleTitle,
  ArticleWrapper,
  ArticleIntroduction,
  OneColumn,
} from 'ndla-ui';
import { injectT } from 'ndla-i18n';
import Link from 'react-router-dom/Link';

import { toSearch } from '../../routeHelpers';

const BetaFrontpage = ({ searchEnabled, t }) => (
  <OneColumn cssModifier="narrow">
    <ArticleWrapper>
      <LayoutItem layout="center">
        <ArticleTitle>{t('welcomePage.beta.title')}</ArticleTitle>
        <ArticleIntroduction>{t('welcomePage.beta.intro')}</ArticleIntroduction>
      </LayoutItem>
      <LayoutItem layout="center">
        <h2>{t('welcomePage.beta.whatHelp')}</h2>
        <p>{t('welcomePage.beta.help')}</p>
        <h2>{t('welcomePage.beta.whatsNew')}</h2>
        <ul>
          <li>{t('welcomePage.beta.item1')}</li>
          <li>{t('welcomePage.beta.item2')}</li>
          <li>{t('welcomePage.beta.item3')}</li>
        </ul>
        <h3>{t('welcomePage.beta.newStructure')}</h3>
        <p>{t('welcomePage.beta.structure')}</p>
        <h3>{t('welcomePage.beta.newContent')}</h3>
        <p>{t('welcomePage.beta.content')}</p>
        <h3>{t('welcomePage.beta.newLp')}</h3>
        <p>{t('welcomePage.beta.lp')}</p>
        <h3>{t('welcomePage.beta.newDesign')}</h3>
        <p>{t('welcomePage.beta.design')}</p>
        <h3>{t('welcomePage.beta.whatNow')}</h3>
        <p>{t('welcomePage.beta.soon')}</p>
      </LayoutItem>
    </ArticleWrapper>
    {searchEnabled ? (
      <section>
        <Link to={toSearch()}>{t('welcomePage.search')}</Link>
      </section>
    ) : null}
  </OneColumn>
);

BetaFrontpage.propTypes = {
  searchEnabled: bool,
};

export default injectT(BetaFrontpage);
