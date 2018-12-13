import React, { Component } from 'react';
import { func, arrayOf, object, shape, string } from 'prop-types';
import { SearchField } from '@ndla/ui';
import queryString from 'query-string';
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
    const query = evt.target.value;
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
    const { t, locale } = this.props;

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

    return (
      <MastheadSearchModal
        onSearchExit={this.onClearQuery}
        searchFieldRef={this.searchFieldRef}>
        <Query
          fetchPolicy="no-cache"
          variables={searchParams}
          ssr={false}
          query={groupSearchQuery}>
          {({ data, error }) =>
            error || (
              <SearchField
                placeholder={t('searchPage.searchFieldPlaceholder')}
                value={query}
                onChange={this.onQueryChange}
                onSearch={this.onSearch}
                filters={
                  subject ? [{ title: subject.name, value: subject.id }] : []
                }
                onFilterRemove={this.onFilterRemove}
                messages={{
                  searchFieldTitle: t('searchPage.search'),
                }}
                allResultUrl={
                  searchString && searchString.length > 0
                    ? `/search?${searchString}`
                    : '/search'
                }
                searchResult={this.mapResults(data.groupSearch)}
                resourceToLinkProps={res =>
                  searchResultToLinkProps(res, locale)
                }
              />
            )
          }
        </Query>
      </MastheadSearchModal>
    );
  }
}

MastheadSearch.propTypes = {
  subject: shape({
    id: string,
    name: string,
  }).isRequired,
  results: arrayOf(object),
  history: shape({
    push: func.isRequired,
  }).isRequired,
  locale: string,
};

export default injectT(withRouter(MastheadSearch));
