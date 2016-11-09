/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes } from 'react';
import formatDate from '../../util/formatDate';

const Citation = ({ ...props }) => {
  const { article } = props;
  const citation = {
    authors: article.copyright.authors.map(author => author.name).join(', '),
    created: article.created,
    place: 'Oslo',
    title: article.title,
    year: article.created,
    today: formatDate(new Date()),
    uri: window.location.href,
  };

  const citeMap = (citationBody) => {
    const { authors, created, place, title, year, today, uri } = citationBody;
    const citationStyles = [
      {
        name: 'MLA',
        format: (<span>{authors}. {year}. &laquo;{title}&raquo;. <em>Norsk Digital Læringsarena</em>. Lest {today}. {uri}</span>),
      },
      {
        name: 'Harvard',
        format: (<span>{authors} ({year}) <em>{title}</em> [Internett]. {place}: Norsk Digital Læringsarena. Tilgjengelig fra: {uri} [Lest {today}].</span>),
      },
      {
        name: 'Chicago',
        format: (<span>{authors}. &laquo;{title}&raquo;. {created}. Norsk Digital Læringsarena. Internett. &lt;{uri}&gt; {today}.</span>),
      },
    ];
    return citationStyles;
  };

  return (
    <div>
      <h2>Referansestiler</h2>
      {citeMap(citation).map((style, key) =>
        <div key={key}>
          <h2>{style.name}</h2>
          <p>{style.format}</p>
        </div>)}
    </div>
  );
};

Citation.propTypes = {
  article: PropTypes.object.isRequired,
};

export default Citation;
