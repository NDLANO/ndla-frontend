/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes, Component } from 'react';

import { Article as UIArticle, LicenseByline, TopicBreadcrumb, OneColumn } from 'ndla-ui';
import {
  initArticleScripts,
  removeEventListenerForResize,
  removeAsideClickListener } from 'ndla-article-scripts';
import getLicenseByAbbreviation from 'ndla-licenses';
import { toTopic } from '../../../routes';
import { injectT } from '../../../i18n';
import ToggleLicenseBox from './ToggleLicenseBox';
import LicenseBox from '../../../components/license/LicenseBox';
import { SubjectShape, TopicShape } from '../../../shapes';


class Article extends Component {

  componentDidMount() {
    initArticleScripts();
  }

  componentWillUnmount() {
    removeEventListenerForResize();
    removeAsideClickListener();
  }

  renderToggleLicenseBox(showByline = false) {
    const { article, locale, t } = this.props;
    const licenseType = article.copyright.license.license;
    const authorsList = article.copyright.authors.map(author => author.name).join(', ');
    const license = getLicenseByAbbreviation(licenseType, locale);

    return (
      <ToggleLicenseBox
        openTitle={t('article.openLicenseBox', { contentType: article.contentType.toLowerCase() })}
        closeTitle={t('article.closeLicenseBox')}
        licenseBox={<LicenseBox article={article} locale={locale} license={license} />}
      >
        { showByline ?
          <LicenseByline license={license}>
            <span className="article_meta">{authorsList}. Publisert: {article.created}</span>.
          </LicenseByline>
          : null
        }
      </ToggleLicenseBox>
    );
  }

  render() {
    const { article, subject, topicPath } = this.props;

    return (
      <section className="c-article-content">
        <OneColumn cssModifier="narrow">
          <section>
            { subject ? <TopicBreadcrumb toSubjects={() => '/'} subjectsTitle="Fag" subject={subject} topicPath={topicPath} toTopic={toTopic}>Du er her:</TopicBreadcrumb> : null }
            {this.renderToggleLicenseBox()}
            <h1>{article.title}</h1>
            <UIArticle.Introduction introduction={article.introduction} />
          </section>
        </OneColumn>
        <OneColumn cssModifier="narrow">
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </OneColumn>
        <OneColumn cssModifier="narrow">
          <section>
            { article.footNotes ? <UIArticle.FootNotes footNotes={article.footNotes} /> : null }
            {this.renderToggleLicenseBox(true)}
            <a className="article-old-ndla-link" rel="noopener noreferrer" target="_blank" href={article.oldNdlaUrl}>Gå til orginal artikkel</a>
          </section>
        </OneColumn>
      </section>
    );
  }
}


Article.propTypes = {
  article: PropTypes.shape({
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    copyright: PropTypes.shape({
      authors: PropTypes.array.isRequired,
    }).isRequired,
  }).isRequired,
  subject: SubjectShape,
  topicPath: PropTypes.arrayOf(TopicShape),
  locale: PropTypes.string.isRequired,
};


export default injectT(Article);
