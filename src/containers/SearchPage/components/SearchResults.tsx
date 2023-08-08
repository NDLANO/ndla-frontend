/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { Fragment } from 'react';
import { SearchTypeResult, constants } from '@ndla/ui';
import { SearchGroup, TypeFilter } from '../searchHelpers';

const { contentTypes } = constants;

export type ViewType = 'grid' | 'list';
interface Props {
  showAll?: boolean;
  handleSubFilterClick: (type: string, filterId: string) => void;
  handleShowMore: (type: string) => void;
  searchGroups: SearchGroup[];
  typeFilter: Record<string, TypeFilter>;
  viewType: ViewType;
  loading: boolean;
}
const SearchResults = ({
  showAll,
  handleSubFilterClick,
  handleShowMore,
  searchGroups,
  typeFilter,
  viewType,
  loading,
}: Props) => {
  return (
    <>
      {searchGroups
        .map((group) => {
          const { totalCount, type, items, resourceTypes } = group;
          const filter = typeFilter[type];
          if (
            (showAll || filter?.selected || type === contentTypes.SUBJECT) &&
            items.length
          ) {
            const toCount = filter ? filter?.page * filter?.pageSize : 0;

            return (
              <Fragment key={`searchresult-${type}`}>
                <SearchTypeResult
                  filters={
                    filter?.filters?.filter(
                      (filter) =>
                        resourceTypes.includes(filter.id) ||
                        filter.id === 'all',
                    ) ?? []
                  }
                  onFilterClick={(id) => handleSubFilterClick(type, id)}
                  items={items.slice(0, toCount)}
                  loading={loading}
                  pagination={{
                    totalCount,
                    toCount: Math.min(toCount, totalCount),
                    onShowMore: () =>
                      handleShowMore(type === 'topic' ? 'topic-article' : type),
                  }}
                  //@ts-ignore
                  type={type === 'topic-article' ? 'topic' : type}
                  viewType={viewType}
                  totalCount={totalCount}
                ></SearchTypeResult>
              </Fragment>
            );
          }
          return null;
        })
        .filter((el): el is JSX.Element => el !== null)}
    </>
  );
};

export default SearchResults;
