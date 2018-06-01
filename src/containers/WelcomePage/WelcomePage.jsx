/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';

import { compose } from 'redux';
import { FrontpageHeader, FrontpageSubjectsWrapper, FrontpageSubjectsSection, InfoWidget, FrontpageSearchSection, OneColumn, FrontpageHighlighted, ContentCard, FrontpageInfo} from 'ndla-ui';
import { injectT } from 'ndla-i18n';
import { EmailOutline, Facebook, Twitter } from 'ndla-icons/common';
import { breakpoints } from 'ndla-util';
import { toSubject } from '../../routeHelpers';
import { GraphQLResourceShape } from '../../graphqlShapes'
import { frontpageQuery } from '../../queries';
import { runQueries } from '../../util/runQueries';
import handleError from '../../util/handleError';

const getMetaInformation = (meta) => {
  if(!meta) {
    return {
      image: '',
      text: '',
    };
  }
  return {
    text: meta.metaDescription,
    image: meta.metaImage,
  }
}

const getResourceType = (resourceTypes) => {
  if (!resourceTypes || resourceTypes.length === 0) {
    return '';
  }
  return resourceTypes[0].name;
}

export class WelcomePage extends Component {
  static async getInitialProps(ctx) {
    const { client } = ctx;
    try {
      return runQueries(client, [
        {
          query: frontpageQuery,
        },
      ]);
    } catch (error) {
      handleError(error);
      return null;
    }
  }

  constructor(){
    super()
    this.state = {
      expanded: null,
      searchText: '',
    }
  }

  onExpand = (expanded) => {
    this.setState({expanded})
  }

  onSearchFieldChange = (evt) => {
    evt.preventDefault();
    this.setState({searchText: evt.target.value})
  }

  onSearch = (evt) => {
    evt.preventDefault();

    const { history } = this.props;
    history.push({
      pathname: '/search',
      search: queryString.stringify({
        query: this.state.searchText,
        page: 1,
      }),
    });
  }

  render() {
    const { t, data } = this.props;
    if (!data || !data.frontpage) {
      return null;
    }

    const { frontpage } = data;
    const { expanded, searchText } = this.state
    const categories = frontpage.categories ? frontpage.categories.map(category => ({ name: category.name, subjects: category.subjects.map(categorySubject => ({text: categorySubject.name, url: toSubject(categorySubject.id)})) })) : [];
    const contentCards = frontpage.topical ? frontpage.topical.map(resource => ({id: resource.id, title: resource.name, isFilm: false, type: getResourceType(resource.resourceTypes), url: resource.path, ...getMetaInformation(resource.meta)})) : [];
    return (
      <Fragment>
        <FrontpageHeader
          heading={t('welcomePage.heading.heading')}
          searchFieldValue={searchText}
          onSearch={this.onSearch}
          onSearchFieldChange={this.onSearchFieldChange}
          searchFieldPlaceholder={t('welcomePage.heading.searchFieldPlaceholder')}
          messages={{
            searchFieldTitle: t('welcomePage.heading.messages.searchFieldTitle'),
            menuButton: t('welcomePage.heading.messages.menuButton'),
          }}
          links={[
            {
              href: 'https://om.ndla.no',
              text: t('welcomePage.heading.links.aboutNDLA'),
            },
            {
              url: '/#language-select',
              text:  t('welcomePage.heading.links.changeLanguage'),
            },
          ]}
        />
        <main>
          <FrontpageSubjectsWrapper>
            {categories.map(category => (
                <FrontpageSubjectsSection
                  key={category.name}
                  id={category.name}
                  expanded={expanded === category.name}
                  onExpand={this.onExpand}
                  heading={t(`welcomePage.category.${category.name}`)}
                  subjects={category.subjects}

                />
              ))}
          </FrontpageSubjectsWrapper>
          <OneColumn>
            <FrontpageSearchSection
              heading={t('welcomePage.search')}
              searchFieldValue={this.state.searchText}
              onSearchFieldChange={this.onSearchFieldChange}
              onSearch={this.onSearch}
            />
          <FrontpageHighlighted heading={t('welcomePage.highlighted')}>
              {contentCards.map(card => (
                <div key={`slide-${card.id}`}>
                  <ContentCard
                    url={card.url}
                    heading={card.title}
                    description={card.text}
                    isFilm={card.isFilm}
                    type={card.type}
                    images={[
                      {
                        url: card.image,
                        types: Object.keys(breakpoints),
                      },
                    ]}
                  />
                </div>
              ))}
            </FrontpageHighlighted>
            <FrontpageInfo>
              <InfoWidget
                heading={t('newsLetter.heading')}
                description={t('newsLetter.description')}
                mainLink={{
                  name: t('newsLetter.mainLinkName'),
                  href: 'http://om.ndla.no/nyhetsbrev/',
                }}
                iconLinks={[
                  {
                    icon: <EmailOutline />,
                    name: t('newsLetter.iconLinkName'),
                  },
                ]}
              />
              <InfoWidget
                heading={t('welcomePage.socialMedia.heading')}
                description={t('welcomePage.socialMedia.description')}
                mainLink={{
                  name: t('welcomePage.socialMedia.mainLink.name'),
                  href: 'https://www.facebook.com/ndla.no/',
                }}
                iconLinks={[
                  {
                    name: 'Facebook',
                    href: 'https://www.facebook.com/ndla.no/',
                    icon: <Facebook />,
                  },
                  {
                    name: 'Twitter',
                    href: 'https://twitter.com/ndla_no',
                    icon: <Twitter />,
                  },
                ]}
              />
              <InfoWidget
                heading={t('welcomePage.aboutNDLA.heading')}
                description={t('welcomePage.aboutNDLA.description')}
                mainLink={{
                  name: t('welcomePage.aboutNDLA.mainLink.name'),
                  href: 'https://om.ndla.no/',
                }}
              />
            </FrontpageInfo>
          </OneColumn>
        </main>
      </Fragment>
    );
  }
}

WelcomePage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  data: PropTypes.shape({
    topical: PropTypes.arrayOf(PropTypes.shape(GraphQLResourceShape)),
    categories: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        subjects: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            path: PropTypes.string.isRequired,
          })
        )}
      ))
  }),
};

export default compose(injectT)(WelcomePage);
