/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';
import { stepNumbers } from './pagerHelpers';


export const PageLink = ({ children, page, query: currentQuery, pathname, onClick, modifier }) => {
  const modifierClass = modifier ? `search-stepper_step--${modifier}` : '';
  const classes = classNames('search-stepper_step', modifierClass);

  const query = Object.assign({}, currentQuery, { page });
  const linkToPage = {
    pathname,
    query,
  };

  const handleClick = () => onClick(query);

  return <Link className={classes} onClick={handleClick} to={linkToPage} >{children}</Link>;
};

PageLink.propTypes = {
  page: PropTypes.number.isRequired,
  query: PropTypes.object.isRequired,
  pathname: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  modifier: PropTypes.string,
};

export default function Pager(props) {
  const { page, lastPage, ...rest } = props;

  const steps = stepNumbers(page, lastPage);

  const pageLinks = steps.map(n => {
    if (n === page) {
      return <span key={n} className="search-stepper_step search-stepper_step--active">{n}</span>;
    }
    return <PageLink key={n} page={n} {...rest}>{n}</PageLink>;
  });

  const prevPageLink = steps[0] < page ? <PageLink modifier="back" page={page - 1} {...rest}> {'<'} </PageLink> : null;
  const nextPageLink = page < lastPage ? <PageLink modifier="forward" page={page + 1} {...rest}> {'>'} </PageLink> : null;

  return (
    <div className="search-stepper">
      {prevPageLink}
      {pageLinks}
      {nextPageLink}
    </div>
  );
}

Pager.propTypes = {
  page: PropTypes.number.isRequired,
  pathname: PropTypes.string.isRequired,
  lastPage: PropTypes.number.isRequired,
  query: PropTypes.object.isRequired,
  onClick: PropTypes.func,
};

Pager.defaultProps = {
  onClick: () => {},
};
