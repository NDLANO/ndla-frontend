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

import { FilterShape, TopicShape } from '../../shapes';

const MultidisciplinarySubjectPage = ({ filters, topics }) => {
  const itemFilters = filters.map(filter => ({
    label: filter.name,
    ...filter,
  }));
  const items = topics.map(topic => ({
    title: topic.name,
    introduction: topic.meta.metaDescription,
    image: topic.meta.metaImage.url,
    imageAlt: topic.meta.metaImage.alt,
    subjects: topic.filters.map(filter => filter.name),
    url: '#',
    ...topic,
  }));

  return (
    <MultidisciplinarySubject
      filters={itemFilters}
      onFilterClick={() => {}}
      items={items}
      totalItemsCount={items.length}
    />
  );
};

MultidisciplinarySubjectPage.propTypes = {
  subjectId: PropTypes.string,
  filters: PropTypes.arrayOf(FilterShape),
  topics: PropTypes.arrayOf(TopicShape),
};

export default MultidisciplinarySubjectPage;
