import React, { Component } from 'react';
import { bool, func, arrayOf, object, shape, string } from 'prop-types';
import { ToggleSearchButton, SearchOverlay, SearchField } from 'ndla-ui';
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

class MastheadSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      subject: props.subject,
    };
  }

  onFilterRemove = () => {
    this.setState({ subject: undefined });
  };

  onQueryChange = evt => {
    const query = evt.target.value;
    this.setState({ query }, this.executeSearch(query));
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
    const { searchIsOpen, openToggle, results, location, t } = this.props;

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
      <ToggleSearchButton
        isOpen={searchIsOpen}
        onToggle={openToggle}
        messages={{ buttonText: t('searchPage.search') }}>
        {(onClose, isOpen) => (
          <SearchOverlay close={onClose} isOpen={isOpen}>
            <SearchField
              placeholder={t('searchPage.searchFieldPlaceholder')}
              value={query}
              onChange={this.onQueryChange}
              onSearch={this.onSearch}
              resourceToLinkProps={res => searchResultToLinkProps(res, results)}
              filters={
                subject ? [{ title: subject.name, value: subject.id }] : []
              }
              onFilterRemove={this.onFilterRemove}
              messages={{
                contentTypeResultShowMoreLabel: t(
                  'searchPage.searchField.contentTypeResultShowMoreLabel',
                ),
                contentTypeResultShowLessLabel: t(
                  'searchPage.searchField.contentTypeResultShowLessLabel',
                ),
                allResultButtonText: t(
                  'searchPage.searchField.allResultButtonText',
                ),
                searchFieldTitle: t('searchPage.search'),
                searchResultHeading: t(
                  'searchPage.searchField.searchResultHeading',
                ),
                contentTypeResultNoHit: t(
                  'searchPage.searchField.contentTypeResultNoHit',
                ),
              }}
              allResultUrl={
                searchString && searchString.length > 0
                  ? `/search?${searchString}`
                  : '/search'
              }
              searchResult={resultsMapped}
            />
          </SearchOverlay>
        )}
      </ToggleSearchButton>
    );
  }
}

MastheadSearch.propTypes = {
  searchIsOpen: bool.isRequired,
  openToggle: func.isRequired,
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
