/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes } from 'react';


const FootNote = ({ footNote }) =>
  <li className="article_foot-note">
    {`${footNote.title} (${footNote.year}), ${footNote.authors.join(' ')} Edition: ${footNote.edition}, Publisher: ${footNote.publisher}`}
  </li>;

FootNote.propTypes = {
  refNr: PropTypes.string.isRequired,
  footNote: PropTypes.shape({
    title: PropTypes.string.isRequired,
    year: PropTypes.string.isRequired,
    authors: PropTypes.array.isRequired,
    edition: PropTypes.string.isRequired,
    publisher: PropTypes.string.isRequired,
  }),
};


const ArticleFootNotes = ({ footNotes }) => (
  <ol className="article_foot-notes">
    {
    Object.keys(footNotes).map(key => (
      <FootNote key={key} refNr={key.replace('ref_', '')} footNote={footNotes[key]} />
    ))
    }
  </ol>
);

ArticleFootNotes.propTypes = {
  footNotes: PropTypes.object,
};

export default ArticleFootNotes;
