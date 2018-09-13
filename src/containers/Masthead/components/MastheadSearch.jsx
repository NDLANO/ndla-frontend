import React, { Component } from 'react';
import { func, arrayOf, object, shape, string } from 'prop-types';
import { SearchField } from 'ndla-ui';
import queryString from 'query-string';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { injectT } from 'ndla-i18n';
import { searchResultToLinkProps } from '../../SearchPage/searchHelpers';
import { getGroupResults } from '../../SearchPage/searchSelectors';
import * as searchActions from '../../SearchPage/searchActions';
import { contentTypeMapping } from '../../../util/getContentTypeFromResourceTypes';
import { LocationShape } from '../../../shapes';
import MastheadSearchModal from './MastheadSearchModal';

class MastheadSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      subject: props.subject,
    };
    this.searchFieldRef = React.createRef();
  }

  onFilterRemove = () => {
    this.setState({ subject: undefined });
  };

  onQueryChange = evt => {
    const query = evt.target.value;
    this.setState({ query }, this.executeSearch(query));
  };

  onClearQuery = () => {
    this.setState({ query: '' }, this.executeSearch(''));
  };

  onSearch = evt => {
    evt.preventDefault();

    const { history } = this.props;
    const { query, subject } = this.state;
    this.executeSearch(query);
    history.push({
      pathname: '/search',
      search: `?${queryString.stringify({
        query: query.length > 0 ? query : undefined,
        subjects: subject ? subject.id : undefined,
      })}`,
    });
  };

  executeSearch = query => {
    const { groupSearch } = this.props;
    const { subject } = this.state;

    const searchParams = {
      query,
      subjects: subject ? subject.id : undefined,
      'resource-types':
        'urn:resourcetype:learningPath,urn:resourcetype:subjectMaterial,urn:resourcetype:tasksAndActivities',
    };
    groupSearch(`?${queryString.stringify(searchParams)}`);
  };

  render() {
    const { results, location, t } = this.props;

    if (location.pathname.includes('search')) {
      return null;
    }

    const { query, subject } = this.state;
    const searchString = queryString.stringify({
      query: query && query.length > 0 ? query : undefined,
      subjects: subject ? subject.id : undefined,
    });

    const resultsMapped = results.map(result => {
      const { contentType } = contentTypeMapping[result.resourceType];
      return {
        ...result,
        title: t(`contentTypes.${contentType}`),
      };
    });

    return (
      <MastheadSearchModal
        onSearchExit={this.onClearQuery}
        searchFieldRef={this.searchFieldRef}>
        <SearchField
          placeholder={t('searchPage.searchFieldPlaceholder')}
          value={query}
          onChange={this.onQueryChange}
          onSearch={this.onSearch}
          filters={subject ? [{ title: subject.name, value: subject.id }] : []}
          onFilterRemove={this.onFilterRemove}
          messages={{
            searchFieldTitle: t('searchPage.search'),
          }}
          allResultUrl={
            searchString && searchString.length > 0
              ? `/search?${searchString}`
              : '/search'
          }
          searchResult={resultsMapped}
          resourceToLinkProps={res => searchResultToLinkProps(res, results)}
        />
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
  groupSearch: func.isRequired,
  history: shape({
    push: func.isRequired,
  }).isRequired,
  location: LocationShape,
};

const mapDispatchToProps = {
  groupSearch: searchActions.groupSearch,
};

const mapStateToProps = state => ({
  results: getGroupResults(state),
});

export default compose(
  injectT,
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(MastheadSearch);
