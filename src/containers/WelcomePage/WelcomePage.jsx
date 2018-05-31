/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { FrontpageHeader, FrontpageSubjectsWrapper, FrontpageSubjectsSection, InfoWidget, FrontpageSearchSection, OneColumn, FrontpageHighlighted, ContentCard} from 'ndla-ui';
import { injectT } from 'ndla-i18n';
import { breakpoints } from 'ndla-util';
import { HelmetWithTracker } from 'ndla-tracker';
import { toSubject } from '../../routeHelpers';
import { SubjectShape } from '../../shapes';
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
    text: meta.description,
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
    }
  }

  onExpand = (expanded) => {
    this.setState({expanded})
  }

  render() {
    const { t, data, hasFailed } = this.props;
    if (!data || !data.frontpage) {
      return null;
    }

    console.log(data)

    const { frontpage } = data;
    const { expanded } = this.state
    const subjects = frontpage.subjects ? frontpage.subjects.map(subject => ({ category: subject.category, subjects: subject.subjects.map(categorySubject => ({text: categorySubject.name, url: toSubject(categorySubject.id)})) })) : [];
    const contentCards = frontpage.topical ? frontpage.topical.map(resource => ({title: resource.name, isFilm: false, type: getResourceType(resource.resourceTypes), url: resource.path, ...getMetaInformation(resource.meta)})) : [];
    return (
      <Fragment>
        <FrontpageHeader
          heading="Nasjonal digital læringsarena"
          searchFieldValue=""
          onSearchFieldChange={() => {}}
          searchFieldPlaceholder="Søk etter f.eks emner, lærestoff, nøkkelord …"
          messages={{
            searchFieldTitle: 'Søk',
            menuButton: 'Meny',
          }}
          links={[
            {
              url: '#1',
              text: 'Om NDLA',
            },
            {
              url: '#3',
              text: 'Change language',
            },
          ]}
        />
        <main>
          <FrontpageSubjectsWrapper>
            {subjects.map(categorySubject => (
                <FrontpageSubjectsSection
                  expanded={expanded === categorySubject.category}
                  onExpand={this.onExpand}
                  id={categorySubject.category}
                  heading={t(`frontpage.category.${categorySubject.category}`)}
                  subjects={categorySubject.subjects}
                />
              ))}
          </FrontpageSubjectsWrapper>
          <OneColumn>
            <FrontpageSearchSection
              heading="Søk"
              searchFieldValue=""
              onSearchFieldChange={() => {}}
            />
            <FrontpageHighlighted heading="Aktuelt">
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
          </OneColumn>
        </main>
      </Fragment>
    );
  }
}

WelcomePage.propTypes = {
  hasFailed: PropTypes.bool.isRequired,
  subjects: PropTypes.arrayOf(SubjectShape),
};

export default compose(injectT)(WelcomePage);
