/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { MultidisciplinarySubject } from '@ndla/ui';

import { FilterShape, TopicShape, LocationShape } from '../../shapes';
import { toTopic } from '../../routeHelpers';
import MultidisciplinarySubjectArticle from './MultidisciplinarySubjectArticle';


const MultidisciplinarySubjectPage = ({ subjectId, topicId, filters, topics, location, locale,  }) => {
  const [selectedFilters, setSelectedFilters] = useState([]);

  const onFilterClick = id => {
    const newFilters = [...selectedFilters];
    const idIndex = newFilters.indexOf(id);
    if (idIndex > -1) {
      newFilters.splice(idIndex, 1);
    } else {
      newFilters.push(id);
    }
    setSelectedFilters(newFilters);
  };

  const filterItems = items => {
    if (!selectedFilters.length) {
      return items;
    }
    return items.filter(item =>
      item.filters.some(filter => selectedFilters.includes(filter.id)),
    );
  };

  const itemFilters = filters.map(filter => ({
    label: filter.name,
    selected: selectedFilters.includes(filter.id),
    ...filter,
  }));

  const items = topics.map(topic => ({
    title: topic.name,
    introduction: topic.meta.metaDescription,
    image: topic.meta.metaImage.url,
    imageAlt: topic.meta.metaImage.alt,
    subjects: topic.filters.map(filter => filter.name),
    url: toTopic(subjectId, undefined, topic.id),
    ...topic,
  }));

  const filteredItems = filterItems(items);

  if (topicId) {
    return (
      <MultidisciplinarySubjectArticle
        topicId={topicId}
        subjects={['democracy']}
        location={location}
        locale={locale}
      />
    )
  }

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
  subjectId: PropTypes.string,
  topicId: PropTypes.string,
  filters: PropTypes.arrayOf(FilterShape),
  topics: PropTypes.arrayOf(TopicShape),
  location: LocationShape,
  locale: PropTypes.string,
};

export default MultidisciplinarySubjectPage;
