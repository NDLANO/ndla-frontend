/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Helmet from 'react-helmet';
import { OneColumn, BreadCrumblist, SubjectMaterialBadge } from '@ndla/ui';
import { injectT } from '@ndla/i18n';
import { withTracker } from '@ndla/tracker';
import {
  ArticleShape,
  SubjectShape,
  ResourceTypeShape,
  LocationShape,
} from '../../shapes';
import { GraphqlErrorShape } from '../../graphqlShapes';
import Article from '../../components/Article';
import ArticleErrorMessage from './components/ArticleErrorMessage';
import { getArticleScripts } from '../../util/getArticleScripts';
import getStructuredDataFromArticle from '../../util/getStructuredDataFromArticle';
import { getArticleProps } from '../../util/getArticleProps';
import { getAllDimensions } from '../../util/trackingUtil';
import { transformArticle } from '../../util/transformArticle';
import { getFiltersFromUrl } from '../../util/filterHelper';
import Resources from '../Resources/Resources';
import {
  isLearningPathResource,
  getLearningPathUrlFromResource,
} from '../Resources/resourceHelpers';
import { RedirectExternal, Status } from '../../components';
import SocialMediaMetadata from '../../components/SocialMediaMetadata';
import { toTopic } from '../../routeHelpers';

class ArticlePage extends Component {
  static willTrackPageView(trackPageView, currentProps) {
    const { loading, data } = currentProps;
    if (loading || !data) {
      return;
    }
    trackPageView(currentProps);
  }

  static getDimensions(props) {
    const articleProps = getArticleProps(props.data.resource);
    const {
      data: {
        resource: { article },
        subject,
        topicPath,
      },
    } = props;
    return getAllDimensions(
      { article, subject, topicPath },
      articleProps.label,
      true,
    );
  }

  static getDocumentTitle({ t, data }) {
    return `${data.subject?.name || ''} - ${data.resource?.article?.title ||
      ''}${t('htmlTitles.titleTemplate')}`;
  }

  render() {
    const {
      data,
      locale,
      errors,
      skipToContentId,
      location,
      history,
    } = this.props;

    const { resource, topic, resourceTypes, subject, topicPath } = data;
    const topicTitle =
      topicPath.length > 0 ? topicPath[topicPath.length - 1].name : '';
    if (isLearningPathResource(resource)) {
      const url = getLearningPathUrlFromResource(resource);
      return (
        <Status code={307}>
          <RedirectExternal to={url} />
        </Status>
      );
    }

    if (resource === null || resource.article === null) {
      const error = errors?.find(e => e.path.includes('resource')) || {};
      return (
        <div>
          <ArticleErrorMessage
            subject={subject}
            topicPath={topicPath}
            status={error?.status === 404 ? 'error404' : 'error'}>
            {topic && (
              <Resources
                title={topicTitle}
                resourceTypes={resourceTypes}
                supplementaryResources={topic.supplementaryResources}
                coreResources={topic.coreResources}
                locale={locale}
              />
            )}
          </ArticleErrorMessage>
        </div>
      );
    }

    const article = transformArticle(resource.article, locale);
    const scripts = getArticleScripts(article);

    const activeFilterId = getFiltersFromUrl(location);
    const filter = subject.filters.find(filter => filter.id === activeFilterId);
    const [mainTopic, subTopic] = topicPath;

    const handleNav = (e, item) => {
      e.preventDefault();
      const { id } = item;
      if (id !== article.id) {
        const breadCrumbIds = breadCrumbs.map(crumb => crumb.id);
        history.push(
          toTopic(breadCrumbIds[0], [], ...breadCrumbIds.slice(1, breadCrumbIds.indexOf(id) + 1)),
        );
      }
    };

    const breadCrumbs = [
      {
        id: subject.id,
        label: subject.name,
        typename: 'Subjecttype',
        url: '#',
      },
      ...(filter
        ? [
            {
              id: filter.id,
              label: filter.name,
              typename: 'Subject',
              url: '#',
            },
          ]
        : []),
      ...(mainTopic
        ? [
            {
              id: mainTopic.id,
              label: mainTopic.name,
              typename: 'Topic',
              url: '#',
            },
          ]
        : []),
      ...(subTopic
        ? [
            {
              id: subTopic.id,
              label: subTopic.name,
              typename: 'Subtopic',
              url: '#',
            },
          ]
        : []),
      {
        id: article.id,
        label: article.title,
        icon: <SubjectMaterialBadge background size="xx-small" />,
        isCurrent: true,
        url: '#',
      },
    ];

    return (
      <div>
        <Helmet>
          <title>{`${this.constructor.getDocumentTitle(this.props)}`}</title>
          {article?.metaDescription && (
            <meta name="description" content={article.metaDescription} />
          )}
          {scripts.map(script => (
            <script
              key={script.src}
              src={script.src}
              type={script.type}
              async={script.async}
            />
          ))}

          <script type="application/ld+json">
            {JSON.stringify(getStructuredDataFromArticle(article))}
          </script>
        </Helmet>
        <SocialMediaMetadata
          title={`${subject?.name ? subject.name + ' - ' : ''}${article.title}`}
          trackableContent={article}
          description={article.metaDescription}
          locale={locale}
          image={article.metaImage}
        />
        <OneColumn>
          <BreadCrumblist items={breadCrumbs} onNav={handleNav} />
          <Article
            id={skipToContentId}
            article={article}
            locale={locale}
            {...getArticleProps(resource, topic)}>
            {topic && (
              <Resources
                title={topicTitle}
                resourceTypes={resourceTypes}
                supplementaryResources={topic.supplementaryResources}
                coreResources={topic.coreResources}
                locale={locale}
              />
            )}
          </Article>
        </OneColumn>
      </div>
    );
  }
}

ArticlePage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      subjectId: PropTypes.string.isRequired,
      topicId: PropTypes.string.isRequired,
      resourceId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  data: PropTypes.shape({
    resource: PropTypes.shape({
      article: ArticleShape,
      resourceTypes: PropTypes.arrayOf(ResourceTypeShape),
    }),
    topic: PropTypes.shape({
      coreResources: PropTypes.arrayOf(ResourceTypeShape),
      supplementaryResources: PropTypes.arrayOf(ResourceTypeShape),
    }),
    topicPath: PropTypes.arrayOf(PropTypes.object),
    subject: SubjectShape,
    resourceTypes: PropTypes.arrayOf(ResourceTypeShape),
  }),
  location: LocationShape,
  errors: PropTypes.arrayOf(GraphqlErrorShape),
  locale: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  skipToContentId: PropTypes.string,
};

export default injectT(withTracker(ArticlePage));
