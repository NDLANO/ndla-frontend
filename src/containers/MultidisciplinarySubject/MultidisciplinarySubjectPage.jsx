/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { MultidisciplinarySubject } from '@ndla/ui';

import { toTopic } from '../../routeHelpers';
import { getFiltersFromUrlAsArray } from '../../util/filterHelper';
import { useGraphQuery } from '../../util/runQueries';
import { subjectPageQuery } from '../../queries';
import { LocationShape } from '../../shapes';

const MultidisciplinarySubjectPage = ({ match, history, location }) => {
  const selectedFilters = getFiltersFromUrlAsArray(location);

  const subjectId = `urn:${match.path.split('/')[2]}`;
  const { loading, data } = useGraphQuery(subjectPageQuery, {
    variables: {
      subjectId,
    },
  });

  if (loading) {
    return null;
  }

  const onFilterClick = id => {
    const newFilters = [...selectedFilters];
    const idIndex = newFilters.indexOf(id);
    if (idIndex > -1) {
      newFilters.splice(idIndex, 1);
    } else {
      newFilters.push(id);
    }
    history.push({
      search: newFilters.length && `?filters=${newFilters}`,
    });
  };

  const filterItems = items => {
    if (!selectedFilters.length) {
      return items;
    }
    return items.filter(item =>
      item.filters.some(filter => selectedFilters.includes(filter.id)),
    );
  };

  const {
    subject: { filters, topics },
  } = data;

  const itemFilters = filters.map(filter => ({
    label: filter.name,
    selected: selectedFilters.includes(filter.id),
    ...filter,
  }));

  const items = topics.map(topic => ({
    title: topic.name,
    introduction: topic.meta?.metaDescription,
    image: topic.meta?.metaImage?.url,
    imageAlt: topic.meta?.metaImage?.alt,
    subjects: topic.filters.map(filter => filter.name),
    url: toTopic(subjectId, undefined, topic.id),
    ...topic,
  }));

  const filteredItems = filterItems(items);

  return (
    <MultidisciplinarySubject
      filters={itemFilters}
      onFilterClick={onFilterClick}
      items={filteredItems}
      totalItemsCount={filteredItems.length}
    />
  );
};

MultidisciplinarySubjectPage.propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: LocationShape,
};

export default MultidisciplinarySubjectPage;
