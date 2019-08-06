import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SearchField, SearchResultSleeve } from '@ndla/ui';
import queryString from 'query-string';
import BEMHelper from 'react-bem-helper';
import { Query } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import debounce from 'lodash.debounce';
import { injectT } from '@ndla/i18n';
import { groupSearchQuery } from '../../../queries';
import { searchResultToLinkProps } from '../../SearchPage/searchHelpers';
import { contentTypeMapping } from '../../../util/getContentType';
import MastheadSearchModal from './MastheadSearchModal';
import {
  RESOURCE_TYPE_SUBJECT_MATERIAL,
  RESOURCE_TYPE_TASKS_AND_ACTIVITIES,
  RESOURCE_TYPE_LEARNING_PATH,
} from '../../../constants';

const classes = new BEMHelper('c-search-field');

const debounceCall = debounce(fun => fun(), 250);

class MastheadSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      delayedSearchQuery: '',
      subject: props.subject,
    };
    this.searchFieldRef = React.createRef();
  }

  onFilterRemove = () => {
    this.setState({ subject: undefined });
  };

  onQueryChange = evt => {
    const query = evt;
    this.setState({ query });
    debounceCall(() => this.setState({ delayedSearchQuery: query }));
  };

  onClearQuery = () => {
    this.setState({ query: '' });
  };

  onSearch = evt => {
    evt.preventDefault();

    const { history } = this.props;
    const { query, subject } = this.state;
    history.push({
      pathname: '/search',
      search: `?${queryString.stringify({
        query: query.length > 0 ? query : undefined,
        subjects: subject ? subject.id : undefined,
      })}`,
    });
  };

  mapResults = (results = []) =>
    this.state.query.length > 1
      ? results.map(result => {
          const contentType = contentTypeMapping[result.resourceType];
          return {
            ...result,
            resources: result.resources.map(resource => ({
              ...resource,
              resourceType: result.resourceType, // TODO: return resourceType from grahql-api
            })),
            contentType,
            title: this.props.t(`contentTypes.${contentType}`),
          };
        })
      : [];

  render() {
    const { query, delayedSearchQuery, subject } = this.state;
    const { t, hideOnNarrowScreen, locale, ndlaFilm } = this.props;

    const searchString = queryString.stringify({
      query: query && query.length > 0 ? query : undefined,
      subjects: subject ? subject.id : undefined,
    });

    const searchParams = {
      query: delayedSearchQuery,
      subjects: subject ? subject.id : undefined,
      resourceTypes: [
        RESOURCE_TYPE_LEARNING_PATH,
        RESOURCE_TYPE_SUBJECT_MATERIAL,
        RESOURCE_TYPE_TASKS_AND_ACTIVITIES,
      ].join(),
    };
    const filters = subject ? [{ title: subject.name, value: subject.id }] : [];
    const modifiers = ['absolute-position-sleeve'];
    if (subject) modifiers.push('has-filter');

    return (
      <MastheadSearchModal
        onSearchExit={this.onClearQuery}
        hideOnNarrowScreen={hideOnNarrowScreen}
        searchFieldRef={this.searchFieldRef}
        ndlaFilm={ndlaFilm}>
        <Query
          fetchPolicy="no-cache"
          variables={searchParams}
          ssr={false}
          query={groupSearchQuery}>
          {({ data, error }) =>
            error || (
              <form
                action="/search/"
                {...classes('', modifiers)}
                onSubmit={this.onSearch}>
                <SearchField
                  placeholder={t('searchPage.searchFieldPlaceholder')}
                  value={query}
                  onChange={this.onQueryChange}
                  filters={filters}
                  onFilterRemove={this.onFilterRemove}
                  messages={{
                    searchFieldTitle: t('searchPage.search'),
                  }}
                />
                {query.length > 2 && (
                  <SearchResultSleeve
                    result={this.mapResults(data.groupSearch)}
                    searchString={query}
                    allResultUrl={
                      searchString && searchString.length > 0
                        ? `/search?${searchString}`
                        : '/search'
                    }
                    resourceToLinkProps={res =>
                      searchResultToLinkProps(res, locale)
                    }
                  />
                )}
              </form>
            )
          }
        </Query>
      </MastheadSearchModal>
    );
  }
}

MastheadSearch.propTypes = {
  subject: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  hideOnNarrowScreen: PropTypes.bool,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  locale: PropTypes.string,
  ndlaFilm: PropTypes.bool,
};

MastheadSearch.defaultProps = {
  hideOnNarrowScreen: false,
};

export default injectT(withRouter(MastheadSearch));
