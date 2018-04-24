import React from 'react';
import {
  InfoBox,
  LayoutItem,
  ArticleTitle,
  ArticleWrapper,
  ArticleIntroduction,
  OneColumn,
} from 'ndla-ui';
import { injectT } from 'ndla-i18n';

const BetaFrontpage = ({ t }) => (
  <OneColumn cssModifier="narrow">
    <ArticleWrapper>
      <LayoutItem layout="center">
        <InfoBox>
          <p>{t('welcomePage.beta.info')}</p>
        </InfoBox>{' '}
        <ArticleTitle>{t('welcomePage.beta.title')}</ArticleTitle>
        <ArticleIntroduction>{t('welcomePage.beta.intro')}</ArticleIntroduction>
      </LayoutItem>
      <LayoutItem layout="center">
        <h2>{t('welcomePage.beta.whatHelp')}</h2>
        <p>{t('welcomePage.beta.help')}</p>
        <p>{t('welcomePage.beta.tips')}</p>
        <h2>{t('welcomePage.beta.whatsNew')}</h2>
        <ul className="o-list--no-margin-top">
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
        <h2>{t('welcomePage.beta.whatNow')}</h2>
        <p>{t('welcomePage.beta.soon')}</p>
      </LayoutItem>
    </ArticleWrapper>
  </OneColumn>
);

BetaFrontpage.propTypes = {};

export default injectT(BetaFrontpage);
